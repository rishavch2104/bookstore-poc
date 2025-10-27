import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

const Navbar = () => {
  return (
    <header className="px-5 py-2 bg-white shadow-sm font-work-sans ">
      <nav className="flex justify-between items-center">
        <Link href="/">
          <Image src="/logo.png" alt="logo" width={40} height={45} />
        </Link>
        <div className="flex items-center gap-5 text-black">
          <Link href="/books">
            <span>Books</span>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
