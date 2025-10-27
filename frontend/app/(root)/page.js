import SearchForm from '../../components/SearchForm';
import BookCard from '../../components/BookCard';
import { gql } from '@apollo/client';
import { getClient } from '../lib/apolloClient.js';

const GET_BOOKS = gql`
  query GetBooksPageFiltered(
    $limit: Int!
    $offset: Int!
    $filter: BookFilter
    $orderBy: [BookOrder!]
  ) {
    books(limit: $limit, offset: $offset, filter: $filter, orderBy: $orderBy) {
      totalCount
      hasNextPage
      nodes {
        id
        title
        publishedDate
        author {
          id
          name
        }
      }
    }
  }
`;

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
          ...(title && { title: title }),
          ...(author && { author: { name: author } }),
          ...(dateFrom && { publishedDateFrom: dateFrom }),
          ...(dateTo && { publishedDateTo: dateTo }),
        }
      : null;

  const { data } = await getClient().query({
    query: GET_BOOKS,
    variables: { limit, offset, ...(filter != null && { filter }) },
    fetchPolicy: 'no-cache',
  });
  const { nodes = [], hasNextPage, totalCount } = data?.books ?? {};
  return (
    <>
      <section className="pink_container">
        <h1 className="heading"> Find your favourite books</h1>
        <p className="sub-heading !max-w-3xl"> One stop site</p>

        <SearchForm
          title={title}
          author={author}
          dateFrom={dateFrom}
          dateTo={dateTo}
        />
      </section>
      <section className="section_container">
        <p className="text-30-semibold">
          {title ? `Search results for ${title}` : ''}
        </p>

        <ul className="mt-7 card_grid">
          {nodes?.length > 0 ? (
            nodes.map((book, index) => <BookCard key={book?.id} book={book} />)
          ) : (
            <p className="no-results">No results</p>
          )}
        </ul>
        <div className="mt-8 flex items-center gap-3">
          {page > 1 && (
            <a
              className="rounded-2xl bg-gray-200 px-4 py-2"
              href={`/?page=${page - 1}&limit=${limit}${
                title ? `&query=${encodeURIComponent(title)}` : ''
              }`}
            >
              Prev
            </a>
          )}
          {hasNextPage && (
            <a
              className="rounded-2xl bg-black px-4 py-2 text-white"
              href={`/?page=${page + 1}&limit=${limit}${
                title ? `&query=${encodeURIComponent(title)}` : ''
              }`}
            >
              Next
            </a>
          )}
          <span className="opacity-70">Total: {totalCount ?? 0}</span>
        </div>
      </section>
    </>
  );
}
