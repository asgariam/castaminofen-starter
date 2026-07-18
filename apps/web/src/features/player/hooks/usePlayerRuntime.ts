import { useMemo } from 'react';
import { createPlayerRuntimeController } from '../runtime/playerRuntime';
import { usePlayerStore } from '../store/playerStore';

export function usePlayerRuntime() {
  const store = usePlayerStore();

  return useMemo(() => createPlayerRuntimeController(store), [store]);
}
