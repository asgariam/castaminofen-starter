'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { PodcastForm } from '@/features/podcasts/PodcastForm';
import { PodcastFormFields } from '@/features/podcasts/components/PodcastFormFields';
import { useCreatePodcast } from '@/features/podcasts/hooks/usePodcasts';
import { defaultPodcastFormValues, normalizePodcastFormValues, podcastFormSchema } from '@/features/podcasts/utils/podcastForm';
import type { PodcastFormValues } from '@/lib/types';

export default function NewPodcastPage() {
  const router = useRouter();
  const createMutation = useCreatePodcast();
  const form = useForm<PodcastFormValues>({
    resolver: zodResolver(podcastFormSchema),
    defaultValues: defaultPodcastFormValues,
  });

  async function onSubmit(values: PodcastFormValues) {
    try {
      const payload = normalizePodcastFormValues(values);
      const podcast = await createMutation.mutateAsync(payload);
      router.push(`/podcasts/${podcast.id}`);
    } catch {
      // Error is surfaced by the mutation state below.
    }
  }

  return (
    <ProtectedRoute>
      <main className="page-container">
        <PodcastForm
          title="New Podcast"
          submitLabel="Create Podcast"
          error={createMutation.isError ? createMutation.error?.message ?? 'Unable to create podcast' : null}
          isLoading={createMutation.isPending}
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <PodcastFormFields register={form.register} errors={form.formState.errors} />
        </PodcastForm>
      </main>
    </ProtectedRoute>
  );
}
