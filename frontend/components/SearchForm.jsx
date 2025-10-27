// components/SearchForm.js
import React from 'react';
import Form from 'next/form';
import SearchFormReset from './SearchFormReset';
import { Search } from 'lucide-react';
import { Button } from './ui/Button';

const SearchForm = ({ title, author, dateFrom, dateTo }) => {
  return (
    <Form
      action="/"
      scroll={false}
      className="search-form grid w-full gap-3 md:grid-cols-[1fr,1fr,auto] md:items-end"
    >
      {/* Text inputs */}
      <div className="flex flex-col gap-1">
        <label htmlFor="title" className="text-sm opacity-70">
          Title
        </label>
        <input
          id="title"
          name="title"
          defaultValue={title}
          className="w-full rounded-xl border px-3 py-2"
          placeholder="Search Books"
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

      {/* Dates */}
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

      {/* Actions */}
      <div className="flex items-center gap-2 md:col-span-3">
        {(title || author || dateFrom || dateTo) && <SearchFormReset />}
        <Button type="submit" className="search-btn text-white">
          <Search className="search-5" />
        </Button>
      </div>
    </Form>
  );
};

export default SearchForm;
