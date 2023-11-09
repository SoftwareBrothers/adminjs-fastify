import AdminJS, { CurrentAdmin } from "adminjs";
import { FastifyInstance } from "fastify";
import { AuthenticationOptions } from "../types.js";
import { WrongArgumentError } from "../errors.js";

const getRefreshTokenPath = (admin: AdminJS) => {
  const { refreshTokenPath, rootPath } = admin.options;
  const normalizedRefreshTokenPath = refreshTokenPath.replace(rootPath, "");

  return normalizedRefreshTokenPath.startsWith("/")
    ? normalizedRefreshTokenPath
    : `/${normalizedRefreshTokenPath}`;
};

const MISSING_PROVIDER_ERROR =
  '"provider" has to be configured to use refresh token mechanism';

export const withRefresh = (
  fastifyApp: FastifyInstance,
  admin: AdminJS,
  auth: AuthenticationOptions
): void => {
  const refreshTokenPath = getRefreshTokenPath(admin);

  const { provider } = auth;

  fastifyApp.post(refreshTokenPath, async (request, reply) => {
    if (!provider) {
      throw new WrongArgumentError(MISSING_PROVIDER_ERROR);
    }

    const updatedAuthInfo = await provider.handleRefreshToken(
      {
        data: request.body ?? {},
        query: request.query ?? {},
        params: request.params ?? {},
        headers: request.headers,
      },
      { request, reply }
    );

    let admin = request.session.adminUser as Partial<CurrentAdmin> | null;
    if (!admin) {
      admin = {};
    }

    if (!admin._auth) {
      admin._auth = {};
    }

    admin._auth = {
      ...admin._auth,
      ...updatedAuthInfo,
    };

    request.session.set('adminUser', admin);
    request.session.save(() => {
      reply.send(admin);
    });
  });
};
