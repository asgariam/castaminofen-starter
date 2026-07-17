'use client';

import { useSession } from '@/lib/auth';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';

export default function ProfilePage() {
  const sessionQuery = useSession();

  if (sessionQuery.isLoading) {
    return <LoadingState message="Checking profile..." />;
  }

  if (sessionQuery.isError || !sessionQuery.data) {
    return <ErrorState message="You must be logged in to view profile." />;
  }

  return (
    <main className="page-container">
      <section className="card">
        <h1>Profile</h1>
        <p>
          <strong>Email:</strong> {sessionQuery.data.email}
        </p>
        <p>
          <strong>Name:</strong> {sessionQuery.data.name || '—'}
        </p>
        <p>
          <strong>User ID:</strong> {sessionQuery.data.id}
        </p>
      </section>
    </main>
  );
}
