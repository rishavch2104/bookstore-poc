import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(_, { params }) {
  const token = (await cookies()).get('token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const sp = await params;
  const id = sp?.id;

  if (!id) {
    return NextResponse.json({ error: 'Author ID missing' }, { status: 400 });
  }

  const query = `
    query GetAuthorById($id: ID!) {
      author(id: $id) {
        id
        name
        bio
        dateOfBirth
        books {
          id
          title
          description
          publishedDate
        }
      }
    }
  `;

  try {
    const res = await fetch(process.env.BACKEND_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query,
        variables: { id: String(id) },
      }),
    });

    const { data, errors } = await res.json();

    if (errors) {
      console.error('GraphQL Errors:', errors);
      return NextResponse.json({ error: errors[0].message }, { status: 400 });
    }

    return NextResponse.json({ author: data.author });
  } catch (err) {
    console.error('❌ Failed to fetch author:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  const token = (await cookies()).get('token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const sp = await params;
  const id = sp?.id;

  try {
    const body = await req.json();
    const { name, bio, dateOfBirth } = body;

    const mutation = `
      mutation UpdateAuthor($id: ID!, $input: UpdateAuthorInput!) {
        updateAuthor(id: $id, input: $input) {
          id
          name
          bio
          dateOfBirth
        }
      }
    `;

    const res = await fetch(
      process.env.BACKEND_GRAPHQL_URL || 'http://localhost:4000/graphql',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: mutation,
          variables: {
            id: String(id),
            input: { name, bio, dateOfBirth },
          },
        }),
      }
    );

    const { data, errors } = await res.json();

    if (errors) {
      console.error(errors);
      return NextResponse.json({ error: errors[0].message }, { status: 400 });
    }

    return NextResponse.json({
      message: 'Author updated successfully',
      author: data.updateAuthor,
    });
  } catch (err) {
    console.error('Failed to update author:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  const token = (await cookies()).get('token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = params?.id;
  if (!id) {
    return NextResponse.json({ error: 'Author ID missing' }, { status: 400 });
  }

  const mutation = `
    mutation DeleteAuthor($id: ID!) {
      deleteAuthor(id: $id) {
        id
        name
      }
    }
  `;

  try {
    const res = await fetch(process.env.BACKEND_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: mutation,
        variables: { id: String(id) },
      }),
    });

    const { data, errors } = await res.json();

    if (errors) {
      console.error(errors);
      return NextResponse.json({ error: errors[0].message }, { status: 400 });
    }

    if (!data?.deleteAuthor) {
      return NextResponse.json(
        { error: 'Author not found or already deleted' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Author deleted successfully',
      deletedAuthor: data.deleteAuthor,
    });
  } catch (err) {
    console.error('❌ Failed to delete author:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
