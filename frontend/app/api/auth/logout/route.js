import { NextResponse } from 'next/server';

export async function POST(request) {
  const res = NextResponse.redirect(new URL('/', request.url));

  res.cookies.set('token', '', {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    expires: new Date(0),
  });

  res.cookies.set('role', '', {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    expires: new Date(0),
  });

  return res;
}
