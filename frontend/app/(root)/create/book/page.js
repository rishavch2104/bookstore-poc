import Form from 'next/form';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { Send } from 'lucide-react';
import { createBook } from '@/lib/actions';

const bookSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  authorId: z.string().min(1, 'Author is required'),
  publishedDate: z.string().optional(),
  description: z.string().optional(),
});

async function getAuthors() {
  const base = process.env.FRONT_END_URL; // e.g. https://your-domain.com
  const res = await fetch(new URL('/api/authors', base), { cache: 'no-store' });
  const data = await res.json();
  return data?.authors ?? [];
}

export async function createBookAction(formData) {
  'use server';

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

  const result = await createBook(formData);

  if (result?.status === 'SUCCESS') {
    revalidatePath('/');
    redirect('/');
  }

  redirect(`/books/create?error=Something%20went%20wrong`);
}

export default async function CreateBookPage({ searchParams }) {
  const sp = await searchParams;
  const authors = await getAuthors();

  return (
    <section className="max-w-2xl mx-auto mt-12 px-4">
      <h1 className="text-3xl font-semibold mb-6 text-gray-900">
        Create a New Book
      </h1>

      {(sp.error || sp.titleError || sp.authorIdError) && (
        <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {sp.error ?? 'Please fix the errors below and try again.'}
        </div>
      )}

      <Form
        action={createBookAction}
        className="bg-white p-6 rounded-xl shadow-md flex flex-col gap-6"
      >
        <div>
          <label htmlFor="title" className="text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            placeholder="Book title"
            defaultValue={sp.title ?? ''}
            className="mt-2 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-black focus:outline-none"
          />
          {sp.titleError && (
            <p className="text-red-500 text-sm mt-1">{sp.titleError}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="authorId"
            className="text-sm font-medium text-gray-700"
          >
            Author
          </label>
          <select
            id="authorId"
            name="authorId"
            required
            defaultValue={sp.authorId ?? ''}
            className="mt-2 w-full border border-gray-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-black focus:outline-none"
          >
            <option value="">Select an author</option>
            {authors.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
          {sp.authorIdError && (
            <p className="text-red-500 text-sm mt-1">{sp.authorIdError}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="publishedDate"
            className="text-sm font-medium text-gray-700"
          >
            Published Date
          </label>
          <input
            id="publishedDate"
            name="publishedDate"
            type="date"
            defaultValue={sp.publishedDate ?? ''}
            className="mt-2 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-black focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Write a short description of the book..."
            defaultValue={sp.description ?? ''}
            className="mt-2 w-full border border-gray-300 rounded-lg p-2 h-28 resize-none focus:ring-2 focus:ring-black focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white bg-black hover:bg-gray-800 transition"
        >
          Create Book
          <Send className="w-5 h-5" />
        </button>
      </Form>
    </section>
  );
}
