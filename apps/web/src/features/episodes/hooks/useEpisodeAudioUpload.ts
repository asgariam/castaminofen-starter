import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadEpisodeAudio } from '@/lib/episodes';
import { episodeDetailKey } from './useEpisodeDetail';

export function useEpisodeAudioUpload(episodeId: string) {
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadEpisodeAudio(episodeId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: episodeDetailKey(episodeId) });
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    await uploadMutation.mutateAsync(selectedFile);
    setSelectedFile(null);
  };

  return {
    selectedFile,
    onFileChange: handleFileChange,
    onUpload: handleUpload,
    isUploading: uploadMutation.isPending,
    uploadError: uploadMutation.isError ? uploadMutation.error?.message ?? 'Upload failed' : null,
    uploadSuccess: uploadMutation.isSuccess,
  };
}
