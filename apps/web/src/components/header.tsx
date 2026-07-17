'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, logoutUser } from '@/lib/auth';
import { Button } from '@/components/ui/button';

export function Header() {
  const router = useRouter();
  const sessionQuery = useSession();

  async function handleLogout() {
    await logoutUser();
    router.push('/login');
  }

  return (
    <header className="header">
      <div>
        <Link href="/" className="button button-ghost">
          Castaminofen
        </Link>
      </div>
      <div className="toolbar">
        <Link href="/podcasts" className="button button-secondary">
          Podcasts
        </Link>
        <Link href="/episodes/new" className="button button-secondary">
          New Episode
        </Link>
        {sessionQuery.data ? (
          <>
            <Link href="/profile" className="button button-secondary">
              Profile
            </Link>
            <Button type="button" variant="ghost" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link href="/login" className="button button-secondary">
              Login
            </Link>
            <Link href="/register" className="button button-secondary">
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
