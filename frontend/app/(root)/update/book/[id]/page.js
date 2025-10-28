import Form from 'next/form';

import { Send } from 'lucide-react';
import { updateBookAction, getAllAuthors } from '@/lib/actions';

export default async function UpdateBookPage({ params, searchParams }) {
  const id = (await params).id;
  const sp = await searchParams;

  const { authors } = await getAllAuthors();

  const action = updateBookAction.bind(null, id);
  const {
    title = '',
    authorId = '',
    description = '',
    publishedDate = '',
    returnTo = '/',
  } = sp;

  return (
    <section className="max-w-2xl mx-auto mt-12 px-4">
      <h1 className="text-3xl font-semibold mb-6 text-gray-900">
        Update Book: {sp.title}
      </h1>

      {(sp.error || sp.titleError || sp.authorIdError) && (
        <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {sp.error ?? 'Please fix the errors below and try again.'}
        </div>
      )}

      <Form
        action={action}
        className="bg-white p-6 rounded-xl shadow-md flex flex-col gap-6"
      >
        <input type="hidden" name="returnTo" value={returnTo} />

        <div>
          <label htmlFor="title" className="text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            defaultValue={title}
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
            defaultValue={authorId}
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
            defaultValue={publishedDate}
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
            defaultValue={description}
            className="mt-2 w-full border border-gray-300 rounded-lg p-2 h-28 resize-none focus:ring-2 focus:ring-black focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white bg-black hover:bg-gray-800 transition"
        >
          Update Book
          <Send className="w-5 h-5" />
        </button>
      </Form>
    </section>
  );
}
