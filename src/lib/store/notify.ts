import { writable } from "svelte/store";

export type Notice = { id: string; type?: "info" | "success" | "error"; text: string };

function createNotify() {
  const { subscribe, update } = writable<Notice[]>([]);
  function push(text: string, type: Notice["type"] = "info", ttl = 3000) {
    const id = crypto.randomUUID();
    update((a) => [...a, { id, text, type }]);
    setTimeout(() => update((a) => a.filter((n) => n.id !== id)), ttl);
  }
  return { subscribe, push };
}
export const notify = createNotify();