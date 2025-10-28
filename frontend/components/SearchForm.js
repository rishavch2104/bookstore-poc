import React from 'react';
import Form from 'next/form';
import SearchFormReset from './SearchFormReset';
import { Search } from 'lucide-react';
import { Button } from './ui/Button';

export default function SearchForm({
  variant = 'books',
  action = '/',
  values = {},
}) {
  const {
    title = '',
    author = '',
    dateFrom = '',
    dateTo = '',
    name = '',
    dobFrom = '',
    dobTo = '',
  } = values;

  const hasFilters =
    (variant === 'books' && (title || author || dateFrom || dateTo)) ||
    (variant === 'authors' && (name || dobFrom || dobTo));

  return (
    <Form
      action={action}
      scroll={false}
      className="search-form grid w-full gap-3 md:grid-cols-[1fr,1fr,auto] md:items-end justify-center"
    >
      {variant === 'books' ? (
        <>
          <div className="flex flex-col gap-1">
            <label htmlFor="title" className="text-sm opacity-70">
              Title
            </label>
            <input
              id="title"
              name="title"
              defaultValue={title}
              className="w-full rounded-xl border px-3 py-2"
              placeholder="Search books"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="author" className="text-sm opacity-70">
              Author
            </label>
            <input
              id="author"
              name="author"
              defaultValue={author}
              className="w-full rounded-xl border px-3 py-2"
              placeholder="e.g., Ursula K. Le Guin"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label htmlFor="dateFrom" className="text-sm opacity-70">
                Published from
              </label>
              <input
                id="dateFrom"
                name="dateFrom"
                type="date"
                defaultValue={dateFrom}
                className="w-full rounded-xl border px-3 py-2"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="dateTo" className="text-sm opacity-70">
                Published to
              </label>
              <input
                id="dateTo"
                name="dateTo"
                type="date"
                defaultValue={dateTo}
                className="w-full rounded-xl border px-3 py-2"
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-sm opacity-70">
              Name
            </label>
            <input
              id="name"
              name="name"
              defaultValue={name}
              className="w-full rounded-xl border px-3 py-2"
              placeholder="e.g., Octavia E. Butler"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label htmlFor="dobFrom" className="text-sm opacity-70">
                Born from
              </label>
              <input
                id="dobFrom"
                name="dobFrom"
                type="date"
                defaultValue={dobFrom}
                className="w-full rounded-xl border px-3 py-2"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="dobTo" className="text-sm opacity-70">
                Born to
              </label>
              <input
                id="dobTo"
                name="dobTo"
                type="date"
                defaultValue={dobTo}
                className="w-full rounded-xl border px-3 py-2"
              />
            </div>
          </div>
        </>
      )}

      <div className="flex items-center gap-2 md:col-span-3">
        {hasFilters && <SearchFormReset href={action} variant={variant} />}
        <Button type="submit" className="search-btn text-white">
          <Search className="search-5" />
        </Button>
      </div>
    </Form>
  );
}
