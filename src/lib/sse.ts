/**
 * In-process pub/sub used to fan out new messages to SSE streams.
 *
 * Each server instance keeps its own listener registry. For multi-instance
 * deployments this must be replaced with a shared broker (e.g. Redis
 * PUBLISH/SUBSCRIBE) — the subscription contract stays the same.
 */

type Listener = (payload: string) => void;

const listeners = new Map<string, Set<Listener>>();

export function subscribe(channel: string, listener: Listener): () => void {
  let channelListeners = listeners.get(channel);
  if (!channelListeners) {
    channelListeners = new Set();
    listeners.set(channel, channelListeners);
  }
  channelListeners.add(listener);

  return () => {
    channelListeners.delete(listener);
    if (channelListeners.size === 0) listeners.delete(channel);
  };
}

export function publish(channel: string, payload: unknown): void {
  const channelListeners = listeners.get(channel);
  if (!channelListeners || channelListeners.size === 0) return;

  const serialized = JSON.stringify(payload);
  for (const listener of channelListeners) {
    try {
      listener(serialized);
    } catch {
      // A failing listener must not break delivery to others.
    }
  }
}

export function publishToMany(channels: string[], payload: unknown): void {
  for (const channel of channels) publish(channel, payload);
}
