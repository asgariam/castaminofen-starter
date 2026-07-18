import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { mapEpisodeToPlayableItem } from '@/features/player/adapters/episodeToPlayable';
import { usePlayerRuntime } from '@/features/player/hooks/usePlayerRuntime';
import { usePlayerState } from '@/features/player/hooks/usePlayerState';
import type { Episode } from '@/lib/types';
import { EpisodeAudioUploadCard } from './EpisodeAudioUploadCard';
import type { ChangeEvent } from 'react';

export type EpisodeDetailViewProps = {
  episode: Episode;
  selectedFile: File | null;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onUpload: () => void;
  isUploading: boolean;
  uploadError?: string | null;
  uploadSuccess: boolean;
};

export function EpisodeDetailView({
  episode,
  selectedFile,
  onFileChange,
  onUpload,
  isUploading,
  uploadError,
  uploadSuccess,
}: EpisodeDetailViewProps) {
  const playerRuntime = usePlayerRuntime();
  const playerState = usePlayerState();
  const playableItem = mapEpisodeToPlayableItem(episode);
  const isCurrentEpisode = playerState.currentItem?.id === episode.id;
  const isPlaying = isCurrentEpisode && playerState.isPlaying;
  const playbackLabel =
    isCurrentEpisode && playerState.playbackStatus === 'loading'
      ? 'Loading...'
      : isPlaying
        ? 'Pause'
        : 'Play';

  const handlePlaybackToggle = async () => {
    if (!episode.audioUrl) {
      return;
    }

    if (isCurrentEpisode && playerState.playbackStatus === 'playing') {
      playerRuntime.pause();
      return;
    }

    if (isCurrentEpisode && playerState.playbackStatus === 'paused') {
      await playerRuntime.play();
      return;
    }

    await playerRuntime.loadItem(playableItem);
  };

  return (
    <main className="page-container">
      <section className="card">
        <div className="header">
          <div>
            <h1>{episode.title}</h1>
            <p>{episode.description || 'No description available.'}</p>
          </div>
        </div>
        <div className="field-row">
          <Card>
            <p>
              <strong>Podcast ID:</strong> {episode.podcastId}
            </p>
            <p>
              <strong>Published At:</strong> {episode.publishedAt || 'Draft'}
            </p>
            <p>
              <strong>Audio URL:</strong> {episode.audioUrl || 'Not uploaded'}
            </p>
            {episode.audioUrl ? (
              <div className="mt-3 space-y-2">
                <Button onClick={() => void handlePlaybackToggle()} variant="secondary" className="w-full sm:w-auto">
                  {playbackLabel}
                </Button>
                <p className="form-message">
                  {isCurrentEpisode ? `Playback status: ${playerState.playbackStatus}` : 'Player runtime is ready for playback.'}
                </p>
              </div>
            ) : (
              <p className="form-message">Audio is not available yet.</p>
            )}
          </Card>
          <EpisodeAudioUploadCard
            selectedFile={selectedFile}
            onFileChange={onFileChange}
            onUpload={onUpload}
            isUploading={isUploading}
            uploadError={uploadError}
            uploadSuccess={uploadSuccess}
          />
        </div>
      </section>
    </main>
  );
}
