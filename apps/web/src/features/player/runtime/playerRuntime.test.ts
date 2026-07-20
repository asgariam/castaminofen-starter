import assert from 'node:assert/strict';
import test from 'node:test';
import { createPlayerRuntimeController } from './playerRuntime';
import { usePlayerStore } from '../store/playerStore';

const createItem = (id: string) => ({
  id,
  title: `Episode ${id}`,
  audioUrl: `https://example.com/${id}.mp3`,
  sourceType: 'episode' as const,
});

const resetStore = () => {
  const store = usePlayerStore.getState();
  usePlayerStore.setState({
    ...store,
    currentItem: null,
    queue: [],
    currentIndex: -1,
    isPlaying: false,
    playbackStatus: 'idle',
    duration: 0,
    currentPosition: 0,
    error: null,
    repeatMode: 'off',
    shuffleEnabled: false,
  });
};

const createTestEngine = () => ({
  load() {},
  async play() {},
  pause() {},
  stop() {},
  setVolume() {},
  setCurrentTime() {},
  getCurrentTime() { return 0; },
  getDuration() { return 0; },
  subscribe() { return () => {}; },
  destroy() {},
});

test('repeat queue wraps to the first item when advancing from the end of the queue', () => {
  resetStore();
  const store = usePlayerStore.getState();
  const items = [createItem('a'), createItem('b'), createItem('c')];

  usePlayerStore.setState({
    ...store,
    currentItem: items[2],
    queue: items,
    currentIndex: 2,
    repeatMode: 'queue',
  });

  const nextItem = usePlayerStore.getState().goToNext();

  assert.equal(nextItem?.id, 'a');
});

test('toggleRepeat cycles through off, one, and queue modes', () => {
  resetStore();
  const store = usePlayerStore.getState();

  usePlayerStore.setState({
    ...store,
    repeatMode: 'off',
  });

  usePlayerStore.getState().toggleRepeat();
  assert.equal(usePlayerStore.getState().repeatMode, 'one');

  usePlayerStore.getState().toggleRepeat();
  assert.equal(usePlayerStore.getState().repeatMode, 'queue');

  usePlayerStore.getState().toggleRepeat();
  assert.equal(usePlayerStore.getState().repeatMode, 'off');
});

test('goToNext uses shuffle selection without mutating the queue order', () => {
  resetStore();
  const store = usePlayerStore.getState();
  const items = [createItem('a'), createItem('b'), createItem('c')];
  const originalRandom = Math.random;

  usePlayerStore.setState({
    ...store,
    currentItem: items[2],
    queue: items,
    currentIndex: 2,
    repeatMode: 'off',
    shuffleEnabled: true,
  });

  Math.random = () => 0;

  try {
    const nextItem = usePlayerStore.getState().goToNext();
    assert.equal(nextItem?.id, 'a');
  } finally {
    Math.random = originalRandom;
  }

  assert.deepEqual(usePlayerStore.getState().queue.map((item) => item.id), ['a', 'b', 'c']);
});

test('selectQueueItem syncs the current item and index for queue UI state', () => {
  resetStore();
  const items = [createItem('a'), createItem('b'), createItem('c')];

  usePlayerStore.setState({
    ...usePlayerStore.getState(),
    queue: items,
    currentItem: items[0],
    currentIndex: 0,
    playbackStatus: 'playing',
    isPlaying: true,
  });

  const selectedItem = usePlayerStore.getState().selectQueueItem(2);

  assert.equal(selectedItem?.id, 'c');
  assert.equal(usePlayerStore.getState().currentIndex, 2);
  assert.equal(usePlayerStore.getState().currentItem?.id, 'c');
});

test('removeQueueItem preserves playback for a non-current item', () => {
  resetStore();
  const items = [createItem('a'), createItem('b'), createItem('c')];

  usePlayerStore.setState({
    ...usePlayerStore.getState(),
    queue: items,
    currentItem: items[0],
    currentIndex: 0,
    playbackStatus: 'playing',
    isPlaying: true,
  });

  usePlayerStore.getState().removeQueueItem(1);

  const state = usePlayerStore.getState();
  assert.deepEqual(state.queue.map((item) => item.id), ['a', 'c']);
  assert.equal(state.currentItem?.id, 'a');
  assert.equal(state.currentIndex, 0);
  assert.equal(state.playbackStatus, 'playing');
});

test('removeQueueItem swaps to the next queued item when the current item is removed', async () => {
  resetStore();
  const items = [createItem('a'), createItem('b'), createItem('c')];
  const controller = createPlayerRuntimeController(usePlayerStore.getState(), {
    load() {},
    async play() {},
    pause() {},
    stop() {},
    setVolume() {},
    setCurrentTime() {},
    getCurrentTime() { return 0; },
    getDuration() { return 0; },
    subscribe() { return () => {}; },
    destroy() {},
  });

  usePlayerStore.setState({
    ...usePlayerStore.getState(),
    queue: items,
    currentItem: items[0],
    currentIndex: 0,
    playbackStatus: 'playing',
    isPlaying: true,
  });

  await controller.removeQueueItem(0);

  const state = usePlayerStore.getState();
  assert.equal(state.currentItem?.id, 'b');
  assert.equal(state.currentIndex, 0);
  assert.equal(state.playbackStatus, 'playing');
  controller.destroy();
});

test('removeQueueItem resets state when the final queue item is removed', async () => {
  resetStore();
  const controller = createPlayerRuntimeController(usePlayerStore.getState(), {
    load() {},
    async play() {},
    pause() {},
    stop() {},
    setVolume() {},
    setCurrentTime() {},
    getCurrentTime() { return 0; },
    getDuration() { return 0; },
    subscribe() { return () => {}; },
    destroy() {},
  });

  usePlayerStore.setState({
    ...usePlayerStore.getState(),
    queue: [createItem('a')],
    currentItem: createItem('a'),
    currentIndex: 0,
    playbackStatus: 'playing',
    isPlaying: true,
  });

  await controller.removeQueueItem(0);

  const state = usePlayerStore.getState();
  assert.equal(state.queue.length, 0);
  assert.equal(state.currentItem, null);
  assert.equal(state.playbackStatus, 'idle');
  controller.destroy();
});

test('clearQueue resets the player state', () => {
  resetStore();
  const items = [createItem('a'), createItem('b')];

  usePlayerStore.setState({
    ...usePlayerStore.getState(),
    queue: items,
    currentItem: items[0],
    currentIndex: 0,
    playbackStatus: 'playing',
    isPlaying: true,
  });

  usePlayerStore.getState().clearQueue();

  const state = usePlayerStore.getState();
  assert.equal(state.queue.length, 0);
  assert.equal(state.currentItem, null);
  assert.equal(state.playbackStatus, 'idle');
});

test('loadItem reports a clear error when an item has no audio source', async () => {
  resetStore();
  const store = usePlayerStore.getState();
  const controller = createPlayerRuntimeController(store, {
    load() {},
    async play() {},
    pause() {},
    stop() {},
    setVolume() {},
    setCurrentTime() {},
    getCurrentTime() { return 0; },
    getDuration() { return 0; },
    subscribe() { return () => {}; },
    destroy() {},
  });

  usePlayerStore.setState({
    ...store,
    currentItem: null,
    queue: [],
    currentIndex: -1,
    playbackStatus: 'idle',
    error: null,
    isPlaying: false,
  });

  await controller.loadItem({
    id: 'missing-audio',
    title: 'Missing audio',
    sourceType: 'episode',
  });

  const state = usePlayerStore.getState();
  assert.equal(state.error, 'Audio source is unavailable.');
  assert.equal(state.playbackStatus, 'idle');
  assert.equal(state.currentItem?.id, 'missing-audio');
  controller.destroy();
});

test('next stops gracefully when the queue is empty', async () => {
  const store = usePlayerStore.getState();
  const controller = createPlayerRuntimeController(store, createTestEngine());

  usePlayerStore.setState({
    ...store,
    currentItem: null,
    queue: [],
    currentIndex: -1,
    playbackStatus: 'playing',
    error: null,
    isPlaying: true,
  });

  await controller.next();

  const state = usePlayerStore.getState();
  assert.equal(state.playbackStatus, 'idle');
  assert.equal(state.error, null);
  controller.destroy();
});

test('setCurrentItem normalizes the current index when the queue already exists', () => {
  resetStore();
  const items = [createItem('a'), createItem('b')];

  usePlayerStore.setState({
    ...usePlayerStore.getState(),
    queue: items,
    currentItem: null,
    currentIndex: -1,
  });

  usePlayerStore.getState().setCurrentItem(items[0]);

  const state = usePlayerStore.getState();
  assert.equal(state.currentItem?.id, 'a');
  assert.equal(state.currentIndex, 0);
  assert.equal(state.playbackStatus, 'playing');
});

test('selectQueueItem keeps the active item consistent when the same item is selected again', async () => {
  resetStore();
  const items = [createItem('a'), createItem('b')];
  const controller = createPlayerRuntimeController(usePlayerStore.getState(), createTestEngine());

  usePlayerStore.setState({
    ...usePlayerStore.getState(),
    queue: items,
    currentItem: items[0],
    currentIndex: 0,
    playbackStatus: 'playing',
    isPlaying: true,
  });

  await controller.selectQueueItem(0);

  const state = usePlayerStore.getState();
  assert.equal(state.currentItem?.id, 'a');
  assert.equal(state.currentIndex, 0);
  assert.equal(state.playbackStatus, 'playing');
  controller.destroy();
});

test('removeQueueItem keeps the current index valid when an item before the current one is removed', async () => {
  resetStore();
  const items = [createItem('a'), createItem('b'), createItem('c')];
  const controller = createPlayerRuntimeController(usePlayerStore.getState(), createTestEngine());

  usePlayerStore.setState({
    ...usePlayerStore.getState(),
    queue: items,
    currentItem: items[1],
    currentIndex: 1,
    playbackStatus: 'playing',
    isPlaying: true,
  });

  await controller.removeQueueItem(0);

  const state = usePlayerStore.getState();
  assert.deepEqual(state.queue.map((item) => item.id), ['b', 'c']);
  assert.equal(state.currentItem?.id, 'b');
  assert.equal(state.currentIndex, 0);
  controller.destroy();
});

test('repeat one and shuffle can be enabled together without breaking the active queue item', async () => {
  resetStore();
  const items = [createItem('a'), createItem('b'), createItem('c')];
  const controller = createPlayerRuntimeController(usePlayerStore.getState(), createTestEngine());

  usePlayerStore.setState({
    ...usePlayerStore.getState(),
    queue: items,
    currentItem: items[0],
    currentIndex: 0,
    repeatMode: 'one',
    shuffleEnabled: true,
    playbackStatus: 'playing',
    isPlaying: true,
  });

  await controller.next();

  const state = usePlayerStore.getState();
  assert.equal(state.currentItem?.id, 'a');
  assert.equal(state.repeatMode, 'one');
  assert.equal(state.shuffleEnabled, true);
  controller.destroy();
});

test('repeat queue with shuffle keeps the active item stable when the queue wraps', async () => {
  resetStore();
  const items = [createItem('a'), createItem('b'), createItem('c')];
  const controller = createPlayerRuntimeController(usePlayerStore.getState(), createTestEngine());

  usePlayerStore.setState({
    ...usePlayerStore.getState(),
    queue: items,
    currentItem: items[2],
    currentIndex: 2,
    repeatMode: 'queue',
    shuffleEnabled: true,
    playbackStatus: 'playing',
    isPlaying: true,
  });

  await controller.next();

  const state = usePlayerStore.getState();
  assert.ok(state.currentItem && ['a', 'b', 'c'].includes(state.currentItem.id));
  assert.equal(state.repeatMode, 'queue');
  assert.equal(state.shuffleEnabled, true);
  controller.destroy();
});

test('runtime reports an error state and recovers when another item becomes available', async () => {
  resetStore();
  const controller = createPlayerRuntimeController(usePlayerStore.getState(), createTestEngine());

  usePlayerStore.setState({
    ...usePlayerStore.getState(),
    queue: [createItem('a'), createItem('b')],
    currentItem: createItem('a'),
    currentIndex: 0,
    playbackStatus: 'playing',
    isPlaying: true,
  });

  usePlayerStore.getState().setPlaybackState({ playbackStatus: 'paused', error: 'Unable to load audio playback.' });
  await controller.selectQueueItem(1);

  const state = usePlayerStore.getState();
  assert.equal(state.error, null);
  assert.equal(state.currentItem?.id, 'b');
  assert.equal(state.playbackStatus, 'playing');
  controller.destroy();
});
