import AdminJS from 'adminjs';
import { FastifyInstance } from 'fastify';
import { AuthenticationOptions } from '../types.js';

const getLogoutPath = (admin: AdminJS) => {
  const { logoutPath } = admin.options;

  return logoutPath.startsWith('/') ? logoutPath : `/${logoutPath}`;
};

export const withLogout = (
  fastifyApp: FastifyInstance,
  admin: AdminJS,
  auth: AuthenticationOptions,
): void => {
  const logoutPath = getLogoutPath(admin);
  const { provider } = auth;

  fastifyApp.get(logoutPath, async (request, reply) => {
    if (provider) {
      await provider.handleLogout({ request, reply });
    }

    if (request.session) {
      await request.session.destroy();
    }
    return reply.redirect(admin.options.loginPath);
  });
};
