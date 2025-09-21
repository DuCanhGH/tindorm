// See https://svelte.dev/docs/kit/types#app.d.ts

import type { Session } from "$lib/server/auth";

// for information about these interfaces
declare global {
  namespace App {
    interface Locals {
      user: Session["user"] | undefined;
      session: Session["session"] | undefined;
    }
  } // interface Error {}
  // interface Locals {}
} // interface PageData {}
// interface PageState {}

// interface Platform {}
export {};
