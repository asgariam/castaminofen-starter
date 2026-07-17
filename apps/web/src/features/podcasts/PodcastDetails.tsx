import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { Episode, Podcast } from '@/lib/types';

export type PodcastDetailsProps = {
  podcast: Podcast;
  canManage?: boolean;
  isDeleting?: boolean;
  onDelete?: () => void;
};

export function PodcastDetails({ podcast, canManage = false, isDeleting = false, onDelete }: PodcastDetailsProps) {
  return (
    <section className="card">
      <div className="header">
        <div>
          <h1>{podcast.title}</h1>
          <p>{podcast.description || 'No description available.'}</p>
        </div>
        {canManage ? (
          <div className="toolbar">
            <Link href={`/podcasts/${podcast.id}/edit`} className="button button-secondary">
              Edit
            </Link>
            <Button variant="secondary" onClick={onDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting…' : 'Delete'}
            </Button>
          </div>
        ) : null}
      </div>

      <div className="field-row">
        <Card>
          {podcast.artworkUrl ? (
            <Image
              src={podcast.artworkUrl}
              alt={`${podcast.title} artwork`}
              width={640}
              height={360}
              style={{ width: '100%', borderRadius: '0.85rem', marginBottom: '1rem', objectFit: 'cover' }}
              unoptimized
            />
          ) : null}
          <p>
            <strong>RSS URL:</strong> {podcast.rssUrl}
          </p>
          <p>
            <strong>Website:</strong> {podcast.website || '—'}
          </p>
          <p>
            <strong>Owner:</strong> {podcast.ownerId || '—'}
          </p>
        </Card>

        <Card>
          <h2>Episodes</h2>
          {podcast.episodes?.length ? (
            <div className="field-row">
              {podcast.episodes.map((episode: Episode) => (
                <Card key={episode.id} className="card">
                  <h3>{episode.title}</h3>
                  <p>{episode.description || 'No description'}</p>
                  <Link href={`/episodes/${episode.id}`} className="button button-secondary">
                    View Episode
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <p>No episodes are available yet. Episodes will appear once the backend syncs them.</p>
          )}
        </Card>
      </div>
    </section>
  );
}
