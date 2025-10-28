import Navbar from '../../components/Navbar';
import { cookies } from 'next/headers';

export default async function Layout({ children }) {
  const token = (await cookies()).get('token')?.value;
  const isLoggedIn = Boolean(token);

  return (
    <main className="font-work-sans">
      <Navbar isLoggedIn={isLoggedIn} />
      {children}
    </main>
  );
}
