import { BaseAuthProvider } from "adminjs";
import { FastifyReply, FastifyRequest } from "fastify";

export type AuthenticationOptions = {
  cookiePassword: string;
  cookieName?: string;
  authenticate?: (email: string, password: string, context?: AuthenticationContext) => unknown | null;
  provider?: BaseAuthProvider;
};

export type AuthenticationContext = {
  /**
   * @description Authentication request object
   */
  request: FastifyRequest;
  /**
   * @description Authentication response object
   */
  reply: FastifyReply;
};
