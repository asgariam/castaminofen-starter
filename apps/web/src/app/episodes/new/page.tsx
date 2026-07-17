'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { EpisodeCreateForm } from '@/features/episodes/components/EpisodeCreateForm';
import { useCreateEpisodeForm } from '@/features/episodes/hooks/useCreateEpisodeForm';

export default function NewEpisodePage() {
  const { form, podcastsQuery, error, onSubmit } = useCreateEpisodeForm();

  return (
    <ProtectedRoute>
      <main className="page-container">
        <EpisodeCreateForm form={form} onSubmit={onSubmit} podcastsQuery={podcastsQuery} error={error} />
      </main>
    </ProtectedRoute>
  );
}
