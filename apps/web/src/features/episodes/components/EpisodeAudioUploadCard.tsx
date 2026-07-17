import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { ChangeEvent } from 'react';

export type EpisodeAudioUploadCardProps = {
  selectedFile: File | null;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onUpload: () => void;
  isUploading: boolean;
  uploadError?: string | null;
  uploadSuccess: boolean;
};

export function EpisodeAudioUploadCard({
  selectedFile,
  onFileChange,
  onUpload,
  isUploading,
  uploadError,
  uploadSuccess,
}: EpisodeAudioUploadCardProps) {
  return (
    <Card>
      <h2>Upload Audio</h2>
      <div className="form-field">
        <label htmlFor="audioFile" className="form-label">
          Select audio file
        </label>
        <input
          id="audioFile"
          type="file"
          accept="audio/*"
          onChange={onFileChange}
          className="input"
        />
        <Button
          type="button"
          variant="primary"
          onClick={onUpload}
          disabled={!selectedFile || isUploading}
        >
          {isUploading ? 'Uploading...' : 'Upload Audio'}
        </Button>
        {uploadError && <p className="error-text">{uploadError}</p>}
        {uploadSuccess && <p className="form-message">Audio uploaded successfully.</p>}
      </div>
    </Card>
  );
}
