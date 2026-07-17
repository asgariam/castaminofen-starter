'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useParams } from 'next/navigation';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { EpisodeDetailView } from '@/features/episodes/components/EpisodeDetailView';
import { useEpisodeDetail } from '@/features/episodes/hooks/useEpisodeDetail';
import { useEpisodeAudioUpload } from '@/features/episodes/hooks/useEpisodeAudioUpload';

export default function EpisodeDetailsPage() {
  const params = useParams();
  const episodeId = params?.id as string;

  const query = useEpisodeDetail(episodeId);
  const upload = useEpisodeAudioUpload(episodeId);

  if (query.isLoading) {
    return <LoadingState message="Loading episode..." />;
  }

  if (query.isError || !query.data) {
    return <ErrorState message={query.error?.message ?? 'Episode not found'} />;
  }

  return (
    <ProtectedRoute>
      <EpisodeDetailView
        episode={query.data}
        selectedFile={upload.selectedFile}
        onFileChange={upload.onFileChange}
        onUpload={upload.onUpload}
        isUploading={upload.isUploading}
        uploadError={upload.uploadError}
        uploadSuccess={upload.uploadSuccess}
      />
    </ProtectedRoute>
  );
}
