import { Form, FormField, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { ReactNode, ChangeEvent } from 'react';

export type EpisodeFormProps = {
  title: string;
  submitLabel: string;
  error?: string | null;
  isLoading?: boolean;
  children: ReactNode;
  fileLabel?: string;
  fileName?: string;
  onFileChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  fileInputName?: string;
};

export function EpisodeForm({
  title,
  submitLabel,
  error,
  isLoading,
  children,
  fileLabel,
  fileName,
  onFileChange,
  fileInputName = 'audio',
}: EpisodeFormProps) {
  return (
    <section className="card form-card">
      <h1>{title}</h1>
      <Form className="form-root">
        {children}
        {fileLabel && (
          <FormField>
            <FormLabel htmlFor={fileInputName}>{fileLabel}</FormLabel>
            <Input id={fileInputName} name={fileInputName} type="file" accept="audio/*" onChange={onFileChange} />
            {fileName && <FormMessage>{fileName}</FormMessage>}
          </FormField>
        )}
        {error && <FormMessage>{error}</FormMessage>}
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? 'Saving...' : submitLabel}
        </Button>
      </Form>
    </section>
  );
}
