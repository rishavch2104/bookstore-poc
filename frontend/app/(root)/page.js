import SearchForm from '../../components/SearchForm';
import BookCard from '../../components/BookCard';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { getBookPageAction } from '@/lib/actions';

export const dynamic = 'force-dynamic';

export default async function Home({ searchParams }) {
  const sp = await searchParams;
  const title = sp?.title ?? '';
  const author = (sp?.author ?? '').trim();
  const dateFrom = sp?.dateFrom ?? '';
  const dateTo = sp?.dateTo ?? '';

  const page = Math.max(1, Number(sp?.page ?? 1));
  const limit = Number(sp?.limit ?? 9);
  const offset = (page - 1) * limit;

  const filter =
    title || author || dateFrom || dateTo
      ? {
          ...(title && { title }),
          ...(author && { author: { name: author } }),
          ...(dateFrom && { publishedDateFrom: dateFrom }),
          ...(dateTo && { publishedDateTo: dateTo }),
        }
      : null;

  const buildQuery = (newPage) => {
    const params = new URLSearchParams();

    if (title) params.set('title', title);
    if (author) params.set('author', author);
    if (dateFrom) params.set('dateFrom', dateFrom);
    if (dateTo) params.set('dateTo', dateTo);

    params.set('limit', String(limit));
    params.set('page', String(newPage));

    // Return just "?..." so it works regardless of the current pathname
    return `?${params.toString()}`;
  };

  const res = await getBookPageAction({
    limit,
    offset,
    ...(filter && { filter }),
  });

  if (res.status == 'FAILURE') {
    return <div>NOT FOUND</div>;
  }
  const data = res.data;

  const { nodes = [], hasNextPage, totalCount } = data?.books ?? {};

  const role = (await cookies()).get('role')?.value;

  const isAdmin = role === 'admin';

  return (
    <>
      <section className="pink_container">
        <h1 className="heading">Find your favourite books</h1>
        <p className="sub-heading !max-w-3xl">One stop site</p>

        <SearchForm
          variant="books"
          values={{ title, author, dateFrom, dateTo }}
        />
      </section>

      <section className="section_container">
        <p className="text-30-semibold">
          {title ? `Search results for ${title}` : ''}
        </p>

        <ul className="mt-7 card_grid">
          {nodes?.length > 0 ? (
            nodes.map((book) => (
              <BookCard key={book?.id} book={book} isAdmin={isAdmin} />
            ))
          ) : (
            <p className="no-results">No results</p>
          )}
        </ul>

        <div className="mt-8 flex items-center gap-3">
          {page > 1 && (
            <a
              className="rounded-2xl bg-gray-200 px-4 py-2"
              href={buildQuery(page - 1)}
            >
              Prev
            </a>
          )}
          {hasNextPage && (
            <a
              className="rounded-2xl bg-black px-4 py-2 text-white"
              href={buildQuery(page + 1)}
            >
              Next
            </a>
          )}
          <span className="opacity-70">Total: {totalCount ?? 0}</span>
        </div>
      </section>

      {isAdmin && (
        <Link
          href="/create/book"
          className="fixed bottom-8 right-8 bg-black text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-gray-800 transition"
          aria-label="Add Book"
        >
          <Plus size={28} />
        </Link>
      )}
    </>
  );
}
