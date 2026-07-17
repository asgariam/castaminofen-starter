'use client';

import { useParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useDeletePodcast, usePodcast } from '@/features/podcasts/hooks/usePodcasts';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { PodcastDetails } from '@/features/podcasts/PodcastDetails';

export default function PodcastDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const podcastId = params?.id as string;
  const query = usePodcast(podcastId);
  const deleteMutation = useDeletePodcast();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const canManage = useMemo(() => isAuthenticated, [isAuthenticated]);

  async function handleDelete() {
    if (!podcastId) {
      return;
    }

    const confirmed = window.confirm('Delete this podcast?');
    if (!confirmed) {
      return;
    }

    try {
      await deleteMutation.mutateAsync({ id: podcastId });
      router.push('/podcasts');
    } catch {
      // Error is surfaced by the mutation state below.
    }
  }

  if (query.isLoading) {
    return <LoadingState message="Loading podcast details..." />;
  }

  if (query.isError || !query.data) {
    return <ErrorState message={query.error?.message ?? 'Podcast not found'} />;
  }

  return (
    <main className="page-container">
      {deleteMutation.isError ? <div className="error-state">{deleteMutation.error?.message ?? 'Unable to delete podcast.'}</div> : null}
      <PodcastDetails podcast={query.data} canManage={canManage} isDeleting={deleteMutation.isPending} onDelete={handleDelete} />
    </main>
  );
}
