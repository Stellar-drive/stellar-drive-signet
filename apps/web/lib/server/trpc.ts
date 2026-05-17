import { initTRPC } from '@trpc/server';

/**
 * tRPC server setup.
 *
 * TODO(stellar-drive-signet): add a real context (db client from @stellar-drive-signet/db, the
 * authenticated session, request info) and split routers per domain
 * (profile, wallets, attestations) once features land.
 */
const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const appRouter = router({
  hello: publicProcedure.query(() => {
    return { message: 'Hello from Signet' };
  }),
});

export type AppRouter = typeof appRouter;
