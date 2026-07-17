import { FormField, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import type { PodcastFormValues } from '@/lib/types';

type PodcastFormFieldsProps = {
  register: UseFormRegister<PodcastFormValues>;
  errors: FieldErrors<PodcastFormValues>;
};

export function PodcastFormFields({ register, errors }: PodcastFormFieldsProps) {
  return (
    <>
      <FormField>
        <FormLabel htmlFor="title">Title</FormLabel>
        <Input id="title" {...register('title')} />
        {errors.title ? <p className="error-text">{errors.title.message}</p> : null}
      </FormField>

      <FormField>
        <FormLabel htmlFor="rssUrl">RSS URL</FormLabel>
        <Input id="rssUrl" {...register('rssUrl')} />
        {errors.rssUrl ? <p className="error-text">{errors.rssUrl.message}</p> : null}
      </FormField>

      <FormField>
        <FormLabel htmlFor="description">Description</FormLabel>
        <Input id="description" {...register('description')} />
        {errors.description ? <p className="error-text">{errors.description.message}</p> : null}
      </FormField>

      <FormField>
        <FormLabel htmlFor="website">Website</FormLabel>
        <Input id="website" {...register('website')} />
        {errors.website ? <p className="error-text">{errors.website.message}</p> : null}
      </FormField>

      <FormField>
        <FormLabel htmlFor="artworkUrl">Artwork URL</FormLabel>
        <Input id="artworkUrl" {...register('artworkUrl')} />
        {errors.artworkUrl ? <p className="error-text">{errors.artworkUrl.message}</p> : null}
      </FormField>
    </>
  );
}
