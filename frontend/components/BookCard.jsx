import { formatDate } from '@/lib/utils';
import { EyeIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from './ui/Button';
const BookCard = ({ book }) => {
  const { id, title, description, publishedDate, author, views = 0 } = book;
  return (
    <li className="book-card group" key={id}>
      <div className="flex-between">
        <p className="book_card_date">{formatDate(publishedDate)}</p>
        <div className="flex gap-1.5">
          <EyeIcon className="size-6 text-primary" />
          <span className="text-16-medium">{views}</span>
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
          src="https://placehold.co/48x48"
          alt="placeholder"
          width={48}
          height={48}
          className="book-card_img"
        />
      </Link>
      <div className="flex-between gap-3 mt-5">
        <Button className="book-card_btn" asChild>
          <Link href={`/book/${id}`}>Details</Link>
        </Button>
      </div>
    </li>
  );
};

export default BookCard;
