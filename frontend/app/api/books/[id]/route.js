import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req, { params }) {
  const token = (await cookies()).get('token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const sp = await params;
  const id = sp?.id;

  const query = `
    query GetBookById($id: ID!) {
      book(id: $id) {
        id
        title
        description
        publishedDate
        author {
          id
          name
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
      console.error(errors);
      return NextResponse.json({ error: errors[0].message }, { status: 400 });
    }

    return NextResponse.json({ book: data.book });
  } catch (err) {
    console.error('Failed to fetch book:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
