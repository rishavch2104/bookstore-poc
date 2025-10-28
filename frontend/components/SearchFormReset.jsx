'use client';
import Link from 'next/link';
import { X } from 'lucide-react';
const reset = () => {
  const form = document.querySelector('.search-form');
  if (form) form.reset();
};
const SearchFormReset = ({ variant = 'books' }) => {
  return (
    <button type="reset" onClick={reset}>
      <Link
        href={variant === 'authors' ? '/authors' : '/'}
        className="search-btn text-white"
      >
        <X className="search-5" />
      </Link>
    </button>
  );
};

export default SearchFormReset;
