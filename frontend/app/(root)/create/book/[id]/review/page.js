import Form from 'next/form';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { Send } from 'lucide-react';
import { createReview } from '@/lib/actions';

const reviewSchema = z.object({
  rating: z.string(),
  title: z.string(),
  body: z.string(),
});

export async function createReviewAction(bookId, formData) {
  'use server';
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

  const result = await createReview(formData, bookId);

  if (result?.status === 'SUCCESS') {
    revalidatePath(`/book/${bookId}`);
    redirect(`/book/${bookId}`);
  }

  redirect(`/book/${bookId}/?error=Something%20went%20wrong`);
}

export default async function createReviewPage({ params, searchParams }) {
  const sp = await searchParams;
  const pm = await params;
  const revAction = createReviewAction.bind(null, pm.id);

  return (
    <section className="max-w-2xl mx-auto mt-12 px-4">
      <h1 className="text-3xl font-semibold mb-6 text-gray-900">
        Create a New Review
      </h1>

      {(sp.error || sp.nameError || sp.bioError) && (
        <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {sp.error ?? 'Please fix the errors below and try again.'}
        </div>
      )}

      <Form
        action={revAction}
        className="bg-white p-6 rounded-xl shadow-md flex flex-col gap-6"
      >
        {/* Name */}
        <div>
          <label htmlFor="name" className="text-sm font-medium text-gray-700">
            Rating
          </label>
          <input
            id="rating"
            name="rating"
            type="number"
            required
            placeholder="Rating between 1 to 5"
            defaultValue={sp.rating ?? ''}
            className="mt-2 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-black focus:outline-none"
          />
          {sp.ratingError && (
            <p className="text-red-500 text-sm mt-1">{sp.ratingError}</p>
          )}
        </div>

        <div>
          <label htmlFor="bio" className="text-sm font-medium text-gray-700">
            Review Title
          </label>
          <textarea
            id="title"
            name="title"
            placeholder="Review title."
            defaultValue={sp.title ?? ''}
            className="mt-2 w-full border border-gray-300 rounded-lg p-2 h-28 resize-none focus:ring-2 focus:ring-black focus:outline-none"
          />
          {sp.bioError && (
            <p className="text-red-500 text-sm mt-1">{sp.bioError}</p>
          )}
        </div>
        <div>
          <label htmlFor="bio" className="text-sm font-medium text-gray-700">
            Review Body
          </label>
          <textarea
            id="body"
            name="body"
            placeholder="Review body."
            defaultValue={sp.body ?? ''}
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
          Submit Review
          <Send className="w-5 h-5" />
        </button>
      </Form>
    </section>
  );
}
