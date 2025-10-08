import Link from 'next/link';
import { auth, signOut } from '@/lib/auth';

export default async function MainNav() {
  const session = await auth();
  return (
    <nav className="border-b mb-8">
      <div className="container mx-auto flex gap-6 py-4">
        <Link href="/dashboard" className="font-semibold">Dashboard</Link>
        <Link href="/contacts">Contacts</Link>
        <Link href="/campaigns">Campaigns</Link>
        <Link href="/groups">Groups</Link>
        {!!session && (
          <form className="ml-auto"
            action={async () => {
              "use server"
              await signOut()
            }}
          >
            <button className="text-sm underline" type="submit">Sign Out</button>
          </form>
        )}
      </div>
    </nav>
  );
}