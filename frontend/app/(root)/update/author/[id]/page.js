import Form from 'next/form';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { Send } from 'lucide-react';
import { updateAuthorAction as updateAuthorInLib } from '@/lib/actions';

const schema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  bio: z.string().min(10, 'Bio must be at least 10 characters').optional(),
  dateOfBirth: z.string().optional(),
  returnTo: z.string().optional(),
});

async function updateAuthorServerAction(id, formData) {
  'use server';

  const values = Object.fromEntries(formData.entries());
  const parsed = schema.safeParse(values);

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

  const { name = '', bio = '', dateOfBirth = '', returnTo } = parsed.data;

  const fd = new FormData();
  fd.set('id', id);
  fd.set('name', name);
  fd.set('bio', bio);
  fd.set('dateOfBirth', dateOfBirth);

  const result = await updateAuthorInLib(fd);

  if (result?.status === 'SUCCESS') {
    revalidatePath('/author');
    revalidatePath(`/author/${id}`);
    redirect(returnTo ?? `/author/${id}`);
  }

  redirect(
    `/author/${id}/edit?error=${encodeURIComponent('Something went wrong')}${
      returnTo ? `&returnTo=${encodeURIComponent(returnTo)}` : ''
    }`
  );
}

export default async function UpdateAuthorPage({ params, searchParams }) {
  const id = (await params).id;
  const sp = await searchParams;

  const action = updateAuthorServerAction.bind(null, id);

  const {
    name = '',
    bio = '',
    dateOfBirth = '',
    returnTo = `/author/${id}`,
  } = sp;

  return (
    <section className="max-w-2xl mx-auto mt-12 px-4">
      <h1 className="text-3xl font-semibold mb-6 text-gray-900">
        Update Author{sp.name ? `: ${sp.name}` : ''}
      </h1>

      {(sp.error || sp.nameError || sp.bioError) && (
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
          <label htmlFor="name" className="text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={name}
            className="mt-2 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-black focus:outline-none"
          />
          {sp.nameError && (
            <p className="text-red-500 text-sm mt-1">{sp.nameError}</p>
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
            defaultValue={dateOfBirth}
            className="mt-2 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-black focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="bio" className="text-sm font-medium text-gray-700">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            defaultValue={bio}
            className="mt-2 w-full border border-gray-300 rounded-lg p-2 h-28 resize-none focus:ring-2 focus:ring-black focus:outline-none"
          />
          {sp.bioError && (
            <p className="text-red-500 text-sm mt-1">{sp.bioError}</p>
          )}
        </div>

        <button
          type="submit"
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white bg-black hover:bg-gray-800 transition"
        >
          Update Author
          <Send className="w-5 h-5" />
        </button>
      </Form>
    </section>
  );
}
