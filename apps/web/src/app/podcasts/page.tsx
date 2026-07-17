'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { usePodcasts } from '@/features/podcasts/hooks/usePodcasts';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { PodcastCard } from '@/features/podcasts/PodcastCard';

export default function PodcastsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const query = usePodcasts({ page, limit: 12, search: search || undefined, sort: 'newest' });

  const totalPages = query.data?.pagination.totalPages ?? 1;
  const searchText = useMemo(() => search.trim(), [search]);

  if (query.isLoading) {
    return <LoadingState message="Loading podcasts..." />;
  }

  if (query.isError) {
    return <ErrorState message={query.error?.message ?? 'Unable to load podcasts'} />;
  }

  return (
    <main className="page-container">
      <section className="card">
        <div className="header">
          <div>
            <h1>Podcasts</h1>
            <p>Browse the latest podcasts from the backend library.</p>
          </div>
          <Link href="/podcasts/new" className="button button-primary">
            New Podcast
          </Link>
        </div>

        <div className="form-field">
          <label htmlFor="search" className="form-label">
            Search podcasts
          </label>
          <input
            id="search"
            className="input"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search by title or description"
          />
        </div>

        {query.data?.data.length ? (
          <div className="field-row">
            {query.data.data.map((podcast) => (
              <PodcastCard key={podcast.id} podcast={podcast} />
            ))}
          </div>
        ) : (
          <div className="error-state">No podcasts found for “{searchText || 'your search'}”.</div>
        )}

        {totalPages > 1 ? (
          <div className="toolbar" style={{ justifyContent: 'center', marginTop: '1.5rem' }}>
            <button className="button button-secondary" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1}>
              Previous
            </button>
            <span>{page} / {totalPages}</span>
            <button className="button button-secondary" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page === totalPages}>
              Next
            </button>
          </div>
        ) : null}
      </section>
    </main>
  );
}
