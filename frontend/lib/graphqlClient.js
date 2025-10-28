import { cookies } from 'next/headers';

export async function graphqlRequest(query, variables = {}) {
  const token = cookies().get('token')?.value;

  const res = await fetch(process.env.BACKEND_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  });

  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}
