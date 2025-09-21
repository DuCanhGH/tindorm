import z from "zod";
import { form, getRequestEvent } from "$app/server";
import { auth } from "$lib/server/auth";
import { APIError } from "better-auth";
import { redirect } from "@sveltejs/kit";

export const login = form(z.object({ email: z.email(), password: z.string(), rememberMe: z.stringbool() }), async (input) => {
  const { request } = getRequestEvent();
  try {
    await auth.api.signInEmail({ body: input, headers: request.headers });
    redirect(303, "/");
  } catch (err) {
    if (err instanceof APIError) {
      return { ok: false, code: err.statusCode, message: err.message };
    } else {
      throw err;
    }
  }
});

export const register = form(z.object({ name: z.string(), email: z.email(), password: z.string() }), async (input) => {
  try {
    await auth.api.signUpEmail({
      body: input,
    });
    return { ok: true };
  } catch (err) {
    if (err instanceof APIError) {
      return { ok: false, code: err.statusCode, message: err.message };
    } else {
      throw err;
    }
  }
});
