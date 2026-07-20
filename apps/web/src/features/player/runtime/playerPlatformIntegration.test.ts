import assert from 'node:assert/strict';
import test from 'node:test';
import { buildMediaSessionMetadata, shouldIgnoreKeyboardShortcut, resolveKeyboardShortcutAction } from './playerPlatformIntegration';

const item = {
  id: 'ep-1',
  title: 'Episode One',
  subtitle: 'A deep dive',
  artworkUrl: 'https://example.com/artwork.png',
  audioUrl: 'https://example.com/ep-1.mp3',
  sourceType: 'episode' as const,
};

test('buildMediaSessionMetadata uses the playable item title, subtitle, and artwork', () => {
  const metadata = buildMediaSessionMetadata(item);

  assert.equal(metadata.title, 'Episode One');
  assert.equal(metadata.artist, 'A deep dive');
  assert.equal(metadata.artwork?.[0]?.src, 'https://example.com/artwork.png');
});

test('keyboard shortcuts are ignored for editable targets', () => {
  assert.equal(shouldIgnoreKeyboardShortcut({ tagName: 'INPUT' } as EventTarget), true);
  assert.equal(shouldIgnoreKeyboardShortcut({ tagName: 'TEXTAREA' } as EventTarget), true);
  assert.equal(shouldIgnoreKeyboardShortcut({ tagName: 'SELECT' } as EventTarget), true);
  assert.equal(shouldIgnoreKeyboardShortcut({ tagName: 'DIV', isContentEditable: true } as EventTarget), true);
  assert.equal(shouldIgnoreKeyboardShortcut({ tagName: 'BUTTON' } as EventTarget), false);
});

test('keyboard shortcut resolution maps the expected actions', () => {
  assert.equal(resolveKeyboardShortcutAction({ key: ' ', code: 'Space' } as KeyboardEvent), 'toggle-playback');
  assert.equal(resolveKeyboardShortcutAction({ key: 'ArrowRight', code: 'ArrowRight' } as KeyboardEvent), 'seek-forward');
  assert.equal(resolveKeyboardShortcutAction({ key: 'ArrowLeft', code: 'ArrowLeft' } as KeyboardEvent), 'seek-backward');
  assert.equal(resolveKeyboardShortcutAction({ key: 'ArrowRight', code: 'ArrowRight', shiftKey: true } as KeyboardEvent), 'next-item');
  assert.equal(resolveKeyboardShortcutAction({ key: 'ArrowLeft', code: 'ArrowLeft', shiftKey: true } as KeyboardEvent), 'previous-item');
  assert.equal(resolveKeyboardShortcutAction({ key: 'Enter', code: 'Enter' } as KeyboardEvent), null);
});
