import { NextResponse } from 'next/server';

export async function POST(req) {
  const { email, password } = await req.json();

  const res = await fetch(process.env.BACKEND_GRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        mutation Signup($input: CreateUserInput!) {
          signup(input: $input) {
            token
            user { id email role }
          }
        }
      `,
      variables: { input: { email, password } },
    }),
  });

  const { data, errors } = await res.json();
  if (errors) return NextResponse.json({ errors }, { status: 400 });
  const resData = data?.signup;
  const token = resData.token;
  const user = resData.user;

  const response = NextResponse.json({ user });
  response.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });
  response.cookies.set('role', user.role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });

  return response;
}
