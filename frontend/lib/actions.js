'use server';

import { cookies } from 'next/headers';
import { bookSchema } from './schema/Book';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getClient } from './apolloClient';
import { authorSchema } from './schema/Author';
import { reviewSchema } from './schema/Review';
import {
  createBookQuery,
  deleteBookQuery,
  getBookPageQuery,
  getBookQuery,
  updateBookQuery,
} from './queries/bookQueries';
import {
  createAuthorQuery,
  updateAuthorQuery,
  deleteAuthorQuery,
  getAllAuthorsQuery,
  getAuthorQuery,
  getAuthorPageQuery,
} from './queries/authorQueries';
import { createReviewQuery } from './queries/reviewQueries';

export async function logout() {
  (await cookies()).set('token', '', { maxAge: 0, path: '/' });
  (await cookies()).set('role', '', { maxAge: 0, path: '/' });
  redirect('/');
}

export async function createBookAction(formData) {
  const values = Object.fromEntries(formData.entries());
  const parsed = bookSchema.safeParse(values);

  if (!parsed.success) {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(values))
      if (v) params.set(k, String(v));
    const fieldErrors = parsed.error.flatten().fieldErrors;
    Object.entries(fieldErrors).forEach(([field, msgs]) => {
      if (msgs?.[0]) params.set(`${field}Error`, msgs[0]);
    });
    redirect(`/books/create?${params.toString()}`);
  }

  const token = (await cookies()).get('token')?.value;
  const role = (await cookies()).get('role')?.value;

  if (!token || role !== 'admin') {
    redirect('/');
  }

  const title = formData.get('title');
  const authorId = parseInt(formData.get('authorId'), 10);
  const publishedDate = formData.get('publishedDate');
  const description = formData.get('description');

  try {
    await getClient().mutate({
      mutation: createBookQuery,
      variables: {
        input: { title, authorId, publishedDate, description },
      },
      context: {
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
    });
  } catch (errors) {
    console.log(errors);
    redirect(`/books/create?error=Something%20went%20wrong`);
  }
  revalidatePath('/');
  redirect('/');
}

export async function deleteBookAction(formData) {
  const token = (await cookies()).get('token')?.value;
  const role = (await cookies()).get('role')?.value;

  if (!token || role !== 'admin') {
    throw new Error('Unauthorized');
  }

  const bookId = Number(formData.get('bookId'));

  try {
    await getClient().mutate({
      mutation: deleteBookQuery,
      variables: {
        input: { id: bookId },
      },
      context: {
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
    });
  } catch (errors) {
    console.log(errors);
    redirect(`/books/create?error=Something%20went%20wrong`);
  }
  revalidatePath('/');
  redirect('/');
}

export async function updateBookAction(id, formData) {
  const values = Object.fromEntries(formData.entries());
  const parsed = bookSchema.safeParse(values);

  if (!parsed.success) {
    const params = new URLSearchParams();
    console
      .log('errr')
      [('title', 'authorId', 'publishedDate', 'description')].forEach((k) => {
        const v = values[k];
        if (v) params.set(k, String(v));
      });

    const errs = parsed.error.flatten().fieldErrors;
    Object.entries(errs).forEach(([field, msgs]) => {
      if (msgs?.[0]) params.set(`${field}Error`, msgs[0]);
    });
    redirect(`/books/${id}/edit?${params.toString()}`);
  }

  const token = (await cookies()).get('token')?.value;
  const role = (await cookies()).get('role')?.value;

  if (!token || role?.toLowerCase() !== 'admin') {
    throw new Error('Unauthorized');
  }

  const title = formData.get('title');
  const description = formData.get('description');
  const publishedDate = formData.get('publishedDate');
  const authorId = Number(formData.get('authorId'));

  try {
    await getClient().mutate({
      mutation: updateBookQuery,
      variables: {
        input: {
          id,
          title,
          description,
          publishedDate,
          authorId: authorId,
        },
      },
      context: {
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
    });
  } catch (errors) {
    console.log(errors);
    redirect(
      `/books/${id}/edit?error=Something%20went%20wrong&returnTo=${encodeURIComponent}`
    );
  }
  revalidatePath('/');
  revalidatePath(`/book/${id}`);
  redirect(`/book/${id}`);
}

export async function getBookAction(variables) {
  try {
    const { data } = await getClient().query({
      query: getBookQuery,
      variables,
      fetchPolicy: 'no-cache',
    });
    return { status: 'SUCCESS', book: data?.book };
  } catch (error) {
    console.error('Failed to fetch book:', error);
    return { status: 'FAILURE', error };
  }
}

export async function getBookPageAction(variables) {
  try {
    const { data } = await getClient().query({
      query: getBookPageQuery,
      variables,
      fetchPolicy: 'no-cache',
    });
    return { status: 'SUCCESS', data: data };
  } catch (errors) {
    console.error(errors);
    return { status: 'FAILURE', error: errors };
  }
}

export async function createAuthorAction(formData) {
  const values = Object.fromEntries(formData.entries());
  const parsed = authorSchema.safeParse(values);

  if (!parsed.success) {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(values))
      if (v) params.set(k, String(v));

    const fieldErrors = parsed.error.flatten().fieldErrors;
    Object.entries(fieldErrors).forEach(([field, msgs]) => {
      if (msgs?.[0]) params.set(`${field}Error`, msgs[0]);
    });

    redirect(`/authors/create?${params.toString()}`);
  }

  const token = (await cookies()).get('token')?.value;
  const role = (await cookies()).get('role')?.value;
  if (!token || role?.toLowerCase() !== 'admin')
    throw new Error('Unauthorized');

  const name = formData.get('name');
  const bio = formData.get('bio');
  const dateOfBirth = formData.get('dateOfBirth');

  try {
    await getClient().mutate({
      mutation: createAuthorQuery,
      variables: {
        input: { name, bio, dateOfBirth },
      },
      context: {
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
    });
  } catch (errors) {
    console.log(errors);
    redirect(`/authors/create?error=Something%20went%20wrong`);
  }
  revalidatePath('/authors');
  redirect('/authors');
}

export async function updateAuthorAction(id, formData) {
  const values = Object.fromEntries(formData.entries());
  const parsed = authorSchema.safeParse(values);
  console.log(formData);
  if (!parsed.success) {
    const params = new URLSearchParams();

    ['name', 'bio', 'dateOfBirth', 'returnTo'].forEach((k) => {
      const v = values[k];
      if (v) params.set(k, String(v));
    });

    const errs = parsed.error.flatten().fieldErrors;
    Object.entries(errs).forEach(([field, msgs]) => {
      if (msgs?.[0]) params.set(`${field}Error`, msgs[0]);
    });

    redirect(`/author/${id}/edit?${params.toString()}`);
  }

  const token = (await cookies()).get('token')?.value;
  const role = (await cookies()).get('role')?.value;
  if (!token || role?.toLowerCase() !== 'admin')
    throw new Error('Unauthorized');

  const query = `
    mutation UpdateAuthor($input: UpdateAuthorInput!) {
      updateAuthor(input: $input) {
        id
        name
      }
    }
  `;
  const name = formData.get('name');
  const bio = formData.get('bio');
  const dateOfBirth = formData.get('dateOfBirth');

  try {
    await getClient().mutate({
      mutation: updateAuthorQuery,
      variables: {
        input: { id: id, name, bio, dateOfBirth },
      },
      context: {
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
    });
  } catch (errors) {
    console.log(errors);
    redirect(
      `/author/${id}/edit?error=${encodeURIComponent('Something went wrong')}`
    );
  }
  revalidatePath('/author');
  revalidatePath(`/author/${id}`);
  redirect(`/author/${id}`);
}

export async function deleteAuthorAction(formData) {
  const token = (await cookies()).get('token')?.value;
  const role = (await cookies()).get('role')?.value;

  if (!token || role !== 'admin') {
    throw new Error('Unauthorized');
  }

  const authorId = Number(formData.get('authorId'));

  try {
    await getClient().mutate({
      mutation: deleteAuthorQuery,
      variables: {
        input: { id: authorId },
      },
      context: {
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
    });
  } catch (errors) {
    console.log(errors);
    throw new Error(errors[0]?.message || 'Failed to delete author');
  }
  redirect('/authors');
}

export async function getAllAuthors() {
  const allAuthors = [];
  const limit = 50;
  let offset = 0;
  let hasNextPage = true;

  try {
    while (hasNextPage) {
      const res = await getClient().query({
        query: getAllAuthorsQuery,
        variables: {
          limit,
          offset,
        },
      });

      const { data, errors } = res;

      if (errors) {
        console.error('GraphQL Errors:', errors);
        return { status: 'FAILURE', errors };
      }

      const { nodes, hasNextPage: nextPage } = data.authors;

      if (Array.isArray(nodes)) {
        allAuthors.push(...nodes);
      }

      hasNextPage = nextPage;
      offset += limit;
    }
    return { status: 'SUCCESS', authors: allAuthors };
  } catch (error) {
    console.error('Failed to fetch authors:', error);
    return { status: 'FAILURE', error };
  }
}

export async function getAuthorAction(variables) {
  try {
    const { data } = await getClient().query({
      query: getAuthorQuery,
      variables,
      fetchPolicy: 'no-cache',
    });
    return { status: 'SUCCESS', author: data?.author };
  } catch (error) {
    console.error('Failed to fetch author:', error);
    return { status: 'FAILURE', error };
  }
}

export async function getAuthorPageAction(variables) {
  try {
    const { data } = await getClient().query({
      query: getAuthorPageQuery,
      variables,
      fetchPolicy: 'no-cache',
    });
    return { status: 'SUCCESS', data: data };
  } catch (errors) {
    console.error(errors);
    return { status: 'FAILURE', error: errors };
  }
}

export async function createReviewAction(bookId, formData) {
  const values = Object.fromEntries(formData.entries());

  const parsed = reviewSchema.safeParse(values);

  if (!parsed.success) {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(values))
      if (v) params.set(k, String(v));

    const fieldErrors = parsed.error.flatten().fieldErrors;
    Object.entries(fieldErrors).forEach(([field, msgs]) => {
      if (msgs?.[0]) params.set(`${field}Error`, msgs[0]);
    });

    redirect(`/book/${bookId}`);
  }

  const cookiesObj = await cookies();
  const token = cookiesObj.get('token')?.value;
  const role = cookiesObj.get('role')?.value;
  if (!token || role?.toLowerCase() !== 'user') throw new Error('Unauthorized');

  const rating = Number(formData.get('rating'));
  const title = formData.get('title');
  const body = formData.get('body');

  try {
    await getClient().mutate({
      mutation: createReviewQuery,
      variables: {
        input: { bookId: Number(bookId), rating, title, body },
      },
      context: {
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
    });
  } catch (errors) {
    console.log(errors);
    redirect(`/book/${bookId}/?error=Something%20went%20wrong`);
  }
  revalidatePath(`/book/${bookId}`);
  redirect(`/book/${bookId}`);
}

export async function loginAction(variables) {
  const res = await fetch(process.env.BACKEND_GRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        mutation Login($input: LoginInput!) {
          login(input: $input) {
            token
            user { id email role }
          }
        }
      `,
      variables,
    }),
  });

  const { data, errors } = await res.json();
  if (errors) {
    console.error('Failed to login:', errors);
    return { status: 'FAILURE', errors };
  }
  return { status: 'SUCCESS', data };
}

export async function signupAction(variables) {
  const res = await fetch(process.env.BACKEND_GRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        mutation Signup($input: CreateUserInput!) {
          signup(input: $input) {
            token
            user { id email role }
          }
        }
      `,
      variables,
    }),
  });

  const { data, errors } = await res.json();
  if (errors) {
    console.error('Failed to login:', errors);
    return { status: 'FAILURE', errors };
  }
  return { status: 'SUCCESS', data };
}
