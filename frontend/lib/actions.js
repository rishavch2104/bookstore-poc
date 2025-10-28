'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function logout() {
  (await cookies()).set('token', '', { maxAge: 0, path: '/' });
  (await cookies()).set('role', '', { maxAge: 0, path: '/' });
  redirect('/');
}

export async function createBook(formData) {
  const token = (await cookies()).get('token')?.value;
  const role = (await cookies()).get('role')?.value;

  if (!token || role !== 'admin') {
    redirect('/');
  }

  const title = formData.get('title');
  const authorId = parseInt(formData.get('authorId'), 10);
  const publishedDate = formData.get('publishedDate');
  const description = formData.get('description');

  const res = await fetch(process.env.BACKEND_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: `
        mutation CreateBook($input: CreateBookInput!) {
          createBook(input: $input) {
            id
            title
          }
        }
      `,
      variables: {
        input: { title, authorId, publishedDate, description },
      },
    }),
  });

  const { data, errors } = await res.json();

  if (errors) {
    return { status: 'ERROR', error: errors[0].message };
  }
  return { status: 'SUCCESS', _id: data.createBook.id };
}

export async function deleteBookAction(formData) {
  const token = (await cookies()).get('token')?.value;
  const role = (await cookies()).get('role')?.value;

  if (!token || role !== 'admin') {
    throw new Error('Unauthorized');
  }

  const bookId = Number(formData.get('bookId'));

  const res = await fetch(process.env.BACKEND_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: `
        mutation DeleteBook($input: DeleteBookInput!) {
          deleteBook(input: $input)
        }
      `,
      variables: {
        input: { id: bookId },
      },
    }),
  });

  const { data, errors } = await res.json();

  if (errors) {
    throw new Error(errors[0]?.message || 'Failed to delete book');
  }

  redirect('/');
}

export async function updateBookAction(formData) {
  const token = (await cookies()).get('token')?.value;
  const role = (await cookies()).get('role')?.value;

  if (!token || role?.toLowerCase() !== 'admin') {
    throw new Error('Unauthorized');
  }

  const bookId = Number(formData.get('id'));
  const title = formData.get('title');
  const description = formData.get('description');
  const publishedDate = formData.get('publishedDate');
  const authorId = Number(formData.get('authorId'));

  const res = await fetch(process.env.BACKEND_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: `
        mutation UpdateBook($input: UpdateBookInput!) {
          updateBook(input: $input) {
            id
            title
          }
        }
      `,
      variables: {
        input: {
          id: bookId,
          title,
          description,
          publishedDate,
          authorId: authorId,
        },
      },
    }),
  });

  const { data, errors } = await res.json();

  if (errors) {
    console.error(errors);
    throw new Error(errors[0]?.message || 'Failed to update book');
  }

  return { status: 'SUCCESS', data: data.updateBook };
}

export async function createAuthor(formData) {
  const token = (await cookies()).get('token')?.value;
  const role = (await cookies()).get('role')?.value;
  if (!token || role?.toLowerCase() !== 'admin')
    throw new Error('Unauthorized');

  const name = formData.get('name');
  const bio = formData.get('bio');
  const dateOfBirth = formData.get('dateOfBirth');

  const query = `
    mutation CreateAuthor($input: CreateAuthorInput!) {
      createAuthor(input: $input) {
        id
        name
      }
    }
  `;

  const res = await fetch('http://localhost:4000/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query,
      variables: { input: { name, bio, dateOfBirth } },
    }),
  });

  const { data, errors } = await res.json();
  if (errors) throw new Error(errors[0].message);

  return { status: 'SUCCESS', data: data.createAuthor };
}

// ✅ UPDATE AUTHOR
export async function updateAuthorAction(formData) {
  const token = (await cookies()).get('token')?.value;
  const role = (await cookies()).get('role')?.value;
  if (!token || role?.toLowerCase() !== 'admin')
    throw new Error('Unauthorized');

  const id = formData.get('id');
  const name = formData.get('name');
  const bio = formData.get('bio');
  const dateOfBirth = formData.get('dateOfBirth');

  const query = `
    mutation UpdateAuthor($input: UpdateAuthorInput!) {
      updateAuthor(input: $input) {
        id
        name
      }
    }
  `;

  const res = await fetch('http://localhost:4000/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query,
      variables: { input: { id: String(id), name, bio, dateOfBirth } },
    }),
  });

  const { data, errors } = await res.json();
  if (errors) throw new Error(errors[0].message);

  return { status: 'SUCCESS', data: data.updateAuthor };
}

export async function deleteAuthorAction(formData) {
  const token = (await cookies()).get('token')?.value;
  const role = (await cookies()).get('role')?.value;

  if (!token || role !== 'admin') {
    throw new Error('Unauthorized');
  }

  const authorId = Number(formData.get('authorId'));

  const res = await fetch(process.env.BACKEND_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: `
        mutation DeleteAuthor($input: DeleteAuthorInput!) {
          deleteAuthor(input: $input)
        }
      `,
      variables: {
        input: { id: authorId },
      },
    }),
  });

  const { data, errors } = await res.json();

  if (errors) {
    throw new Error(errors[0]?.message || 'Failed to delete author');
  }

  redirect('/authors');
}

export async function createReview(formData, bookId) {
  const cookiesObj = await cookies();
  const token = cookiesObj.get('token')?.value;
  const role = cookiesObj.get('role')?.value;
  if (!token || role?.toLowerCase() !== 'user') throw new Error('Unauthorized');

  const rating = Number(formData.get('rating'));
  const title = formData.get('title');
  const body = formData.get('body');

  const query = `
    mutation CreateReview($input: CreateReviewInput!) {
      createReview(input: $input) {
        id
        bookId
        userId
        rating
        title
        body
        createdAt
      }
    }
  `;

  const res = await fetch('http://localhost:4000/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query,
      variables: { input: { bookId: Number(bookId), rating, title, body } },
    }),
  });

  const { data, errors } = await res.json();
  if (errors) throw new Error(errors[0].message);

  return { status: 'SUCCESS', data: data.createAuthor };
}
