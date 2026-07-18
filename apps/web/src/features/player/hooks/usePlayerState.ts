import { usePlayerStore } from '../store/playerStore';

export function usePlayerState() {
  return usePlayerStore();
}
