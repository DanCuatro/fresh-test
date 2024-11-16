import { router } from "@/trpc.ts";
import { publicProcedure } from "@/trpc.ts";
import { z } from "zod";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { define } from "@/utils.ts";

const greeting = publicProcedure
.input(z.object({
  name: z.string(),
}))
.output(z.object({
  name: z.string(),
}))
.query((opts) => {
  return {name:`¡Hola ${opts.input.name}!`};
});

const payments = router({
  create: publicProcedure
    .input(z.object({
      amount: z.number(),
      currency: z.string(),
    }))
    .mutation((opts) => {
      return `¡Hola ${opts.input.amount}!`;
    }),
  greeting,
});


const appRouter = router({
  payments,
  greeting,
});

export type AppRouter = typeof appRouter;

export const handler = define.handlers(async(ctx) => {
    return await fetchRequestHandler({
        endpoint: "/api/trpc",
        req: ctx.req,
        router: appRouter,
        createContext: () => ctx,
    });
});
