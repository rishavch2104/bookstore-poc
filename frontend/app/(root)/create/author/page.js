import Form from 'next/form';
import { Send } from 'lucide-react';
import { createAuthorAction } from '@/lib/actions';

export default async function Page({ searchParams }) {
  const sp = await searchParams;

  return (
    <section className="max-w-2xl mx-auto mt-12 px-4">
      <h1 className="text-3xl font-semibold mb-6 text-gray-900">
        Create a New Author
      </h1>

      {(sp.error || sp.nameError || sp.bioError) && (
        <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {sp.error ?? 'Please fix the errors below and try again.'}
        </div>
      )}

      <Form
        action={createAuthorAction}
        className="bg-white p-6 rounded-xl shadow-md flex flex-col gap-6"
      >
        <div>
          <label htmlFor="name" className="text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Author name"
            defaultValue={sp.name ?? ''}
            className="mt-2 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-black focus:outline-none"
          />
          {sp.nameError && (
            <p className="text-red-500 text-sm mt-1">{sp.nameError}</p>
          )}
        </div>

        <div>
          <label htmlFor="bio" className="text-sm font-medium text-gray-700">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            placeholder="Write a short biography..."
            defaultValue={sp.bio ?? ''}
            className="mt-2 w-full border border-gray-300 rounded-lg p-2 h-28 resize-none focus:ring-2 focus:ring-black focus:outline-none"
          />
          {sp.bioError && (
            <p className="text-red-500 text-sm mt-1">{sp.bioError}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="dateOfBirth"
            className="text-sm font-medium text-gray-700"
          >
            Date of Birth
          </label>
          <input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            defaultValue={sp.dateOfBirth ?? ''}
            className="mt-2 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-black focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white bg-black hover:bg-gray-800 transition"
        >
          Create Author
          <Send className="w-5 h-5" />
        </button>
      </Form>
    </section>
  );
}
