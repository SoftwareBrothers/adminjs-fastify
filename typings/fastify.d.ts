import * as Fastify from 'fastify'

declare module 'fastify' {
  interface Session {
    redirectTo?: string;
    adminUser: Record<string, unknown> | null | false | unknown;
  }
}
