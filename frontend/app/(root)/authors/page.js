import { cookies } from 'next/headers';
import { getClient } from '../../../lib/apolloClient.js';

import SearchForm from '../../../components/SearchForm.js';
import AuthorCard from '../../../components/AuthorCard.js';
import { getAuthorPageAction } from '@/lib/actions.js';
export const dynamic = 'force-dynamic';

export default async function Page({ searchParams }) {
  const sp = await searchParams;
  const name = (sp?.name ?? '').trim();
  const dobFrom = sp?.dobFrom ?? '';
  const dobTo = sp?.dobTo ?? '';

  const page = Math.max(1, Number(sp?.page ?? 1));
  const limit = Number(sp?.limit ?? 9);
  const offset = (page - 1) * limit;

  const filter =
    name || dobFrom || dobTo
      ? {
          ...(name && { name }),
          ...(dobFrom && { dateOfBirthFrom: dobFrom }),
          ...(dobTo && { dateOfBirthTo: dobTo }),
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
  const res = await getAuthorPageAction({
    limit,
    offset,
    ...(filter && { filter }),
  });

  if (res.status == 'FAILURE') {
    return <div>NOT FOUND</div>;
  }
  const data = res.data;

  const { nodes = [], hasNextPage, totalCount } = data?.authors ?? {};
  const qs = new URLSearchParams({
    ...(name && { name }),
    ...(dobFrom && { dobFrom }),
    ...(dobTo && { dobTo }),
    limit: String(limit),
  });

  const isAdmin = (await cookies()).get('role')?.value === 'admin';

  return (
    <>
      <section className="pink_container">
        <h1 className="heading">Find authors</h1>
        <p className="sub-heading !max-w-3xl">
          Filter by name or date of birth
        </p>

        <SearchForm
          variant="authors"
          action="/authors"
          values={{ name, dobFrom, dobTo }}
        />
      </section>

      <section className="section_container">
        <ul className="mt-7 card_grid">
          {nodes.length ? (
            nodes.map((a) => <AuthorCard key={a.id} author={a} />)
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
        <a
          href="/create/author"
          className="fixed bottom-8 right-8 bg-black text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-gray-800 transition"
          aria-label="Add Author"
        >
          +
        </a>
      )}
    </>
  );
}
