import { initTRPC } from "@trpc/server";
import type { FreshContext } from "fresh";
import type { State } from "./utils.ts";

type Context = FreshContext<State>;

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure; 