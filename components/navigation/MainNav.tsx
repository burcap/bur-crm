import Link from 'next/link';
import { auth } from '@/lib/auth';

export default async function MainNav() {
  const session = await auth();
  return (
    <nav className="border-b mb-8">
      <div className="container mx-auto flex gap-6 py-4">
        <Link href="/dashboard" className="font-semibold">Dashboard</Link>
        <Link href="/contacts">Contacts</Link>
        <Link href="/campaigns">Campaigns</Link>
        {!!session && (
          <form action="/api/auth/signout" method="post" className="ml-auto">
            <button className="text-sm underline">Sign out</button>
          </form>
        )}
      </div>
    </nav>
  );
}