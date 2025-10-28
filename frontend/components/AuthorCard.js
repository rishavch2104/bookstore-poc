import Image from 'next/image';
import Link from 'next/link';

export default function AuthorCard({ author }) {
  const {
    id,
    name,
    dateOfBirth,
    bio,
    imageUrl = 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=300&auto=format&fit=crop',
  } = author || {};
  const dobText = dateOfBirth ? new Date(dateOfBirth).toDateString() : '—';

  return (
    <Link href={`/author/${id}`}>
      <li className="rounded-2xl border p-4 shadow-sm flex gap-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
          {imageUrl ? (
            <Image
              src={
                'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=300&auto=format&fit=crop'
              }
              alt={name || 'Author'}
              fill
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-xs text-gray-500">
              No Image
            </div>
          )}
        </div>

        <div className="min-w-0">
          <p className="text-lg font-semibold truncate">{name}</p>
          <p className="text-sm opacity-70">DOB: {dobText}</p>

          {bio && <p className="mt-2 text-sm line-clamp-3">{bio}</p>}
        </div>
      </li>
    </Link>
  );
}
