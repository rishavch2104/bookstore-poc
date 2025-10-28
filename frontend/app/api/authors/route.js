import { NextResponse } from 'next/server';

export async function GET() {
  const query = `
    query GetAuthors($limit: Int!, $offset: Int!) {
      authors(limit: $limit, offset: $offset) {
        totalCount
        hasNextPage
        nodes {
          id
          name
        }
      }
    }
  `;

  const allAuthors = [];
  const limit = 50;
  let offset = 0;
  let hasNextPage = true;

  try {
    while (hasNextPage) {
      const res = await fetch(process.env.BACKEND_GRAPHQL_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: { limit, offset },
        }),
      });

      const { data, errors } = await res.json();

      if (errors) {
        console.error('GraphQL Errors:', errors);
        return NextResponse.json({ authors: [] }, { status: 400 });
      }

      const { nodes, hasNextPage: nextPage } = data.authors;

      if (Array.isArray(nodes)) {
        allAuthors.push(...nodes);
      }

      hasNextPage = nextPage;
      offset += limit;
    }

    return NextResponse.json({ authors: allAuthors });
  } catch (error) {
    console.error('Failed to fetch authors:', error);
    return NextResponse.json({ authors: [] }, { status: 500 });
  }
}
