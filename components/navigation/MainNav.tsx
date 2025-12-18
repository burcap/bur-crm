import Link from 'next/link';
import { auth, signOut } from '@/lib/auth';

export const dynamic = "force-dynamic"; // ensure session-driven navbar is rendered per request

const signOutAction = async () => {
  "use server";
  await signOut({ redirectTo: "/login" });
};

export default async function MainNav() {
  const session = await auth();
  const prefetch = !!session;

  return (
    <nav className="border-b mb-8">
      <div className="container mx-auto flex gap-6 py-4">
        <Link href="/dashboard" prefetch={prefetch} className="font-semibold">Dashboard</Link>
        <Link href="/contacts" prefetch={prefetch}>Contacts</Link>
        <Link href="/campaigns" prefetch={prefetch}>Campaigns</Link>
        <Link href="/groups" prefetch={prefetch}>Groups</Link>
        {!!session && (
          <form className="ml-auto" action={signOutAction}>
            <button className="text-sm underline" type="submit">Sign Out</button>
          </form>
        )}
      </div>
    </nav>
  );
}
