import assert from 'node:assert/strict';
import test from 'node:test';
import { createPlayerStore } from './playerStore';

const STORAGE_KEY = 'castaminofen_player_preferences';

function createMemoryStorage(initialEntries: Record<string, string> = {}) {
  const entries = { ...initialEntries };

  return {
    getItem(key: string) {
      return key in entries ? entries[key] : null;
    },
    setItem(key: string, value: string) {
      entries[key] = value;
    },
    removeItem(key: string) {
      delete entries[key];
    },
    clear() {
      Object.keys(entries).forEach((key) => delete entries[key]);
    },
  };
}

test('initializes player preferences from storage on first load', async () => {
  const storage = createMemoryStorage({
    [STORAGE_KEY]: JSON.stringify({ volume: 0.42, repeatMode: 'queue', shuffleEnabled: true }),
  });

  const store = createPlayerStore({ storage });

  assert.equal(store.getState().volume, 0.42);
  assert.equal(store.getState().repeatMode, 'queue');
  assert.equal(store.getState().shuffleEnabled, true);
});

test('persists volume, repeat, and shuffle updates to storage', async () => {
  const storage = createMemoryStorage();

  const store = createPlayerStore({ storage });

  store.getState().setVolume(0.35);
  store.getState().toggleRepeat();
  store.getState().setShuffle(true);

  const savedState = JSON.parse(storage.getItem(STORAGE_KEY) ?? '{}');
  assert.equal(savedState.volume, 0.35);
  assert.equal(savedState.repeatMode, 'one');
  assert.equal(savedState.shuffleEnabled, true);
});

test('ignores invalid persisted values and falls back to defaults', async () => {
  const storage = createMemoryStorage({
    [STORAGE_KEY]: JSON.stringify({ volume: 99, repeatMode: 'invalid', shuffleEnabled: 'yes' }),
  });

  const store = createPlayerStore({ storage });

  assert.equal(store.getState().volume, 0.8);
  assert.equal(store.getState().repeatMode, 'off');
  assert.equal(store.getState().shuffleEnabled, false);
});
