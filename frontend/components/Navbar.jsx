'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navbar({ isLoggedIn }) {
  const pathname = usePathname();
  const isActive = (href) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="px-5 py-2 bg-white shadow-sm font-work-sans">
      <nav className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Image src="/logo.png" alt="logo" width={40} height={45} />
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className={`rounded-xl px-3 py-1 text-sm ${
                isActive('/')
                  ? 'bg-black text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Books
            </Link>
            <Link
              href="/authors"
              className={`rounded-xl px-3 py-1 text-sm ${
                isActive('/authors')
                  ? 'bg-black text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Authors
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-5 text-black">
          {!isLoggedIn ? (
            <>
              <Link href="/auth/login">Login</Link>
              <Link href="/auth/signup">Signup</Link>
            </>
          ) : (
            <form action="/api/auth/logout" method="post">
              <button type="submit" className="text-red-600 hover:underline">
                Logout
              </button>
            </form>
          )}
        </div>
      </nav>
    </header>
  );
}
