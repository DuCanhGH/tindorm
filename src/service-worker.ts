/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />
/// <reference types="@sveltejs/kit" />
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { addEventListeners, createSerwist, RuntimeCache } from "serwist";
import { defaultCache } from "vite-plugin-serwist/worker";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = createSerwist({
  precache: {
    entries: self.__SW_MANIFEST,
    concurrency: 20,
  },
  skipWaiting: true,
  navigationPreload: true,
  clientsClaim: true,
  extensions: [new RuntimeCache(defaultCache)],
});

addEventListeners(serwist);
