import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cookies } from 'next/headers';
import { deleteAuthorAction, getAuthorAction } from '@/lib/actions.js';
import { Trash2 } from 'lucide-react';
import { Pencil } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default async function page({ params }) {
  const sp = await params;
  const role = (await cookies()).get('role')?.value;
  const id = sp?.id;
  const isAdmin = role === 'admin';

  if (!id) {
    return (
      <main className="section_container">
        <div className="pink_container rounded-[30px]">
          <span className="tag">Error</span>
          <h1 className="heading">Missing author ID</h1>
          <p className="sub-heading">
            Provide an <code>id</code> via the URL path{' '}
            <code>/author/[id]</code>.
          </p>
        </div>
      </main>
    );
  }
  const { author } = await getAuthorAction({ id });
  if (!author) {
    return (
      <main className="section_container">
        <div className="pink_container rounded-[30px]">
          <span className="tag">Not Found</span>
          <h1 className="heading">Author not found</h1>
          <p className="sub-heading">
            No author exists with id <code>{id}</code>.
          </p>
        </div>
      </main>
    );
  }

  const books = Array.isArray(author.books) ? author.books : [];
  const totalBooks = books.length;

  return (
    <>
      <section className="pink_container !min-h-[230px] flex flex-col items-center justify-center text-center">
        <h1 className="heading">{author.name}</h1>

        <div className="mt-6 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white px-6 py-3 rounded-xl shadow-md inline-block">
          <p className="text-lg font-semibold">
            {totalBooks} {totalBooks === 1 ? 'Book Written' : 'Books Written'}
          </p>
        </div>
      </section>

      <section className="section_container flex flex-col md:flex-row gap-10 items-start">
        <div className="md:w-1/3 w-full">
          <Image
            src={
              author.avatarUrl ||
              'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop'
            }
            alt={`${author.name} avatar`}
            width={600}
            height={600}
            className="w-full h-auto rounded-xl object-cover drop-shadow-lg"
            priority
          />
        </div>
        <div className="md:w-2/3 w-full space-y-5">
          <h3 className="text-30-bold">About</h3>
          {author.bio ? (
            <article className="prose max-w-none font-work-sans">
              {author.bio}
            </article>
          ) : (
            <p className="text-gray-500">No bio available.</p>
          )}
        </div>
      </section>

      <hr className="my-12 border-gray-200 dark:border-gray-800" />

      <section className="section_container">
        <h3 className="text-30-bold mb-6">Books by {author.name}</h3>

        {totalBooks === 0 ? (
          <div className="rounded-xl border border-dashed p-6 text-center text-gray-500">
            No books yet.
          </div>
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
            {books.map((b) => (
              <li
                key={b.id}
                className="rounded-lg border bg-white/50 dark:bg-zinc-900/40 overflow-hidden hover:shadow-md transition-shadow"
              >
                <Link href={`/book/${b.id}`} className="block hover:opacity-95">
                  <div className="aspect-[3/4] w-full overflow-hidden">
                    <img
                      src={
                        b.coverUrl ||
                        'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=300&auto=format&fit=crop'
                      }
                      alt={`${b.title} cover`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-2 space-y-1">
                    <h4 className="text-sm font-semibold line-clamp-2">
                      {b.title}
                    </h4>
                    {b.publishedDate && (
                      <p className="text-[10px] text-gray-500">
                        {formatDate(b.publishedDate)}
                      </p>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {isAdmin && (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-3">
          {author.books?.length == 0 ? (
            <form action={deleteAuthorAction}>
              <input type="hidden" name="authorId" value={id} />
              <button
                type="submit"
                className="bg-red-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-gray-800 transition"
                title="Delete Book"
              >
                <Trash2 className="size-5" />
              </button>
            </form>
          ) : (
            ''
          )}

          <Link
            href={{
              pathname: `/update/author/${author.id}`,
              query: {
                name: author.name,
                bio: author.bio,
                dateOfBirth: author.dateOfBirth,
              },
            }}
            aria-label="Edit Book"
            className="bg-black text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-gray-800 transition"
          >
            <Pencil className="w-5 h-5" />
          </Link>
        </div>
      )}
    </>
  );
}
