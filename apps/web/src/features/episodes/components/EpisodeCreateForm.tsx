import { Form, FormField, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import type { PaginatedResponse, Podcast } from '@/lib/types';
import type { EpisodeFormValues } from '@/features/episodes/validators/episodeSchema';

export type EpisodeCreateFormProps = {
  form: {
    register: UseFormRegister<EpisodeFormValues>;
    handleSubmit: (callback: (values: EpisodeFormValues) => void) => (event?: React.BaseSyntheticEvent) => Promise<void>;
    formState: {
      errors: FieldErrors<EpisodeFormValues>;
    };
  };
  onSubmit: (values: EpisodeFormValues) => Promise<void>;
  podcastsQuery: {
    isLoading: boolean;
    isError: boolean;
    error?: Error | null;
    data?: PaginatedResponse<Podcast>;
  };
  error?: string | null;
};

export function EpisodeCreateForm({ form, onSubmit, podcastsQuery, error }: EpisodeCreateFormProps) {
  return (
    <section className="card">
      <h1>New Episode</h1>
      <Form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField>
          <FormLabel htmlFor="podcastId">Podcast</FormLabel>
          {podcastsQuery.isLoading ? (
            <LoadingState message="Loading available podcasts..." />
          ) : podcastsQuery.isError ? (
            <ErrorState message={podcastsQuery.error?.message ?? 'Unable to load podcasts'} />
          ) : (
            <select id="podcastId" className="input" {...form.register('podcastId')}>
              <option value="">Select a podcast</option>
              {podcastsQuery.data?.data.map((podcast: Podcast) => (
                <option key={podcast.id} value={podcast.id}>
                  {podcast.title}
                </option>
              ))}
            </select>
          )}
          {form.formState.errors.podcastId && <p className="error-text">{form.formState.errors.podcastId.message}</p>}
        </FormField>

        <FormField>
          <FormLabel htmlFor="title">Title</FormLabel>
          <Input id="title" {...form.register('title')} />
          {form.formState.errors.title && <p className="error-text">{form.formState.errors.title.message}</p>}
        </FormField>

        <FormField>
          <FormLabel htmlFor="description">Description</FormLabel>
          <Input id="description" {...form.register('description')} />
        </FormField>

        <FormField>
          <FormLabel htmlFor="publishedAt">Published At</FormLabel>
          <Input id="publishedAt" type="datetime-local" {...form.register('publishedAt')} />
        </FormField>

        {error && <p className="error-text">{error}</p>}
        <Button type="submit">Create Episode</Button>
      </Form>
    </section>
  );
}
