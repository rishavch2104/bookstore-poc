import { loginAction } from '@/lib/actions';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { email, password } = await req.json();

  const { status, data } = await loginAction({ input: { email, password } });
  if (status == 'FAILURE')
    return NextResponse.json({ errors }, { status: 400 });

  const token = data.login.token;
  const user = data.login.user;

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
