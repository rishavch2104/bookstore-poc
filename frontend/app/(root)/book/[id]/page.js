// File: app/books/[id]/page.jsx
import React from 'react';
import Link from 'next/link';
import { gql } from '@apollo/client';
import { getClient } from '../../../lib/apolloClient.js';
import { formatDate } from '@/lib/utils';
import Image from 'next/image';

const GET_BOOK = gql`
  query GetBookWithReviewsPage($id: ID!, $limit: Int!, $offset: Int!) {
    book(id: $id) {
      id
      title
      publishedDate
      description
      author {
        id
        name
      }
      ratingSummary {
        count
        average
      }
      reviews(limit: $limit, offset: $offset) {
        totalCount
        hasNextPage
        nodes {
          id
          userId
          rating
          title
          body
          createdAt
        }
      }
    }
  }
`;

export default async function Page({ params }) {
  const sp = await params;

  const id = sp?.id;
  const page = Math.max(1, Number(sp?.page ?? 1));
  const limit = Math.max(1, Number(sp?.limit ?? 9));
  const offset = (page - 1) * limit;

  if (!id) {
    return (
      <main className="section_container">
        <div className="pink_container rounded-[30px]">
          <span className="tag">Error</span>
          <h1 className="heading">Missing book ID</h1>
          <p className="sub-heading">
            Provide an <code>id</code> via the URL path <code>/books/[id]</code>{' '}
            or query string <code>?id=...</code>.
          </p>
        </div>
      </main>
    );
  }

  const { data } = await getClient().query({
    query: GET_BOOK,
    variables: { id, limit, offset },
    fetchPolicy: 'no-cache',
  });

  const book = data?.book;
  if (!book) {
    return (
      <main className="section_container">
        <div className="pink_container rounded-[30px]">
          <span className="tag">Not Found</span>
          <h1 className="heading">Book not found</h1>
          <p className="sub-heading">
            No book exists with id <code>{id}</code>.
          </p>
        </div>
      </main>
    );
  }

  const total = book.reviews.totalCount;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const basePath = `/books/${id}`;
  const pageHref = (p) => {
    const usp = new URLSearchParams();
    usp.set('page', String(p));
    usp.set('limit', String(limit));
    return `${basePath}?${usp.toString()}`;
  };

  const showingStart = total ? offset + 1 : 0;
  const showingEnd = Math.min(
    offset + (book.reviews.nodes?.length ?? 0),
    total
  );

  return (
    <>
      {/* Header Section with Rating */}
      <section className="pink_container !min-h-[230px]">
        <p className="tag">{formatDate(book.publishedDate)}</p>
        <h1 className="heading">{book.title}</h1>

        {/* Rating Summary */}
        {book.ratingSummary && (
          <div className="flex items-center gap-2 mt-4">
            <span className="text-yellow-500 text-2xl">★</span>
            <p className="text-lg font-medium">
              {book.ratingSummary.average.toFixed(1)} / 5.0
            </p>
            <p className="text-black-500 text-sm">
              ({book.ratingSummary.count}{' '}
              {book.ratingSummary.count === 1 ? 'review' : 'reviews'})
            </p>
          </div>
        )}
      </section>

      {/* Book Image + Author Info */}
      <section className="section_container flex flex-col md:flex-row gap-10 items-start">
        {/* Left side - Image */}
        <div className="md:w-1/2 w-full">
          <img
            src="https://images.unsplash.com/photo-1512820790803-83ca734da794"
            alt="thumbnail"
            className="w-full h-auto rounded-xl object-cover"
          />
        </div>

        {/* Right side - Content */}
        <div className="md:w-1/2 w-full space-y-5">
          <div className="flex-between gap-5">
            <Link
              href={`/author/${book.author?.id}`}
              className="flex items-center gap-3"
            >
              <Image
                src="https://images.unsplash.com/photo-1512820790803-83ca734da794"
                alt="avatar"
                width={64}
                height={64}
                className="rounded-full drop-shadow-lg"
              />
              <div>
                <p className="text-20-medium">{book.author?.name}</p>
              </div>
            </Link>
          </div>

          <h3 className="text-30-bold">Book Details</h3>
          <p className="text-gray-500">{book.description}</p>
        </div>
      </section>

      {/* Divider */}
      <hr className="my-12 border-gray-200 dark:border-gray-800" />

      {/* Reviews Section */}
      <section className="section_container space-y-6">
        <div className="flex items-end justify-between flex-wrap gap-3">
          <h3 className="text-30-bold">Reviews</h3>
          {total > 0 && (
            <p className="text-sm text-gray-500">
              Showing {showingStart}–{showingEnd} of {total}
            </p>
          )}
        </div>

        {total === 0 ? (
          <div className="rounded-xl border border-dashed p-6 text-center text-gray-500">
            No reviews yet.
          </div>
        ) : (
          <ul className="space-y-5">
            {book.reviews.nodes.map((r) => (
              <li
                key={r.id}
                className="rounded-xl border p-5 bg-white/50 dark:bg-zinc-900/40"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-md bg-amber-100 text-amber-800 px-2 py-0.5 text-xs font-medium">
                      {r.rating.toFixed(1)} / 5.0
                    </span>
                    <p className="text-16-medium">
                      {r.title || 'Untitled review'}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatDate(r.createdAt)}
                  </span>
                </div>
                {r.body && (
                  <p className="mt-3 text-sm leading-6 text-gray-700 dark:text-gray-300">
                    {r.body}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="mt-6 flex items-center justify-between gap-3">
            {/* Prev */}
            <Link
              href={page > 1 ? pageHref(page - 1) : '#'}
              aria-disabled={page === 1}
              className={`px-3 py-2 rounded-lg border text-sm ${
                page === 1
                  ? 'opacity-50 pointer-events-none'
                  : 'hover:bg-gray-50 dark:hover:bg-zinc-800'
              }`}
            >
              ← Prev
            </Link>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
                )
                .reduce((acc, p, _, arr) => {
                  if (acc.length === 0) return [p];
                  const prev = acc[acc.length - 1];
                  if (typeof prev === 'number' && p - prev > 1) acc.push('…');
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, idx) =>
                  p === '…' ? (
                    <span
                      key={`dots-${idx}`}
                      className="px-2 text-sm text-gray-500"
                    >
                      …
                    </span>
                  ) : (
                    <Link
                      key={p}
                      href={pageHref(p)}
                      className={`px-3 py-2 rounded-lg border text-sm ${
                        p === page
                          ? 'bg-gray-900 text-white dark:bg-white dark:text-black'
                          : 'hover:bg-gray-50 dark:hover:bg-zinc-800'
                      }`}
                    >
                      {p}
                    </Link>
                  )
                )}
            </div>

            {/* Next */}
            <Link
              href={page < totalPages ? pageHref(page + 1) : '#'}
              aria-disabled={page >= totalPages}
              className={`px-3 py-2 rounded-lg border text-sm ${
                page >= totalPages
                  ? 'opacity-50 pointer-events-none'
                  : 'hover:bg-gray-50 dark:hover:bg-zinc-800'
              }`}
            >
              Next →
            </Link>
          </nav>
        )}
      </section>
    </>
  );
}
