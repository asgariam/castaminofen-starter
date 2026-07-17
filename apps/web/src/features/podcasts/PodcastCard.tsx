import Link from 'next/link';
import { Card } from '@/components/ui/card';
import type { Podcast } from '@/lib/types';

export function PodcastCard({ podcast }: { podcast: Podcast }) {
  return (
    <Card className="card">
      <div className="header" style={{ alignItems: 'flex-start', flexDirection: 'column' }}>
        <div>
          <h2>{podcast.title}</h2>
          <p>{podcast.description || 'No description available.'}</p>
        </div>
        <div className="toolbar" style={{ marginTop: '0.75rem' }}>
          <Link href={`/podcasts/${podcast.id}`} className="button button-secondary">
            View
          </Link>
          <Link href={`/podcasts/${podcast.id}/edit`} className="button button-secondary">
            Edit
          </Link>
        </div>
      </div>
    </Card>
  );
}
