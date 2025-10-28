import { formatDate } from '@/lib/utils';
import { EyeIcon, Trash2, Pencil } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { deleteBookAction } from '@/lib/actions';

const BookCard = ({ book, isAdmin }) => {
  const { id, title, description, publishedDate, author, views = 0 } = book;

  return (
    <li className="book-card group" key={id}>
      <div className="flex-between">
        <p className="book_card_date">{formatDate(publishedDate)}</p>

        <div className="flex gap-1.5 items-center">
          <EyeIcon className="size-5 text-primary" />
          <span className="text-16-medium">{views}</span>

          {isAdmin && (
            <div className="flex items-center gap-2 ml-3">
              <form action={deleteBookAction}>
                <input type="hidden" name="bookId" value={id} />
                <button
                  type="submit"
                  className="text-red-600 hover:text-red-700 transition"
                  title="Delete Book"
                >
                  <Trash2 className="size-5" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      <div className="flex-between mt-5 gap-5">
        <div className="flex-1">
          <Link href={`/author/${author?.id}`}>
            <p className="text-16-medium line-clamp-1">{author?.name}</p>
          </Link>
          <Link href={`/book/${id}`}>
            <h3 className="text-26-semibold line-clamp-1">{title}</h3>
          </Link>
        </div>
        <Link href={`/author/${author?.id}`}>
          <Image
            src="https://placehold.co/48x48"
            alt="placeholder"
            width={48}
            height={48}
            className="rounded-full"
          />
        </Link>
      </div>

      <Link href={`/book/${id}`}>
        <p className="book-card_desc">{description}</p>
        <Image
          src="https://placehold.co/300x200"
          alt="placeholder"
          width={300}
          height={200}
          className="book-card_img"
        />
      </Link>

      <div className="flex-between gap-3 mt-5">
        <Link
          href={`/book/${id}`}
          className="book-card_btn bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition"
        >
          Details
        </Link>
      </div>
    </li>
  );
};

export default BookCard;
