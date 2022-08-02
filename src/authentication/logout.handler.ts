import AdminJS from 'adminjs';
import { FastifyInstance } from 'fastify';

const getLogoutPath = (admin: AdminJS) => {
  const { logoutPath } = admin.options;

  return logoutPath.startsWith('/') ? logoutPath : `/${logoutPath}`;
};

export const withLogout = (
  fastifyApp: FastifyInstance,
  admin: AdminJS
): void => {
  const logoutPath = getLogoutPath(admin);

  fastifyApp.get(logoutPath, async (request, reply) => {
    if (request.session) {
      request.session.destroy(() => {
        reply.redirect(admin.options.loginPath);
      })
    } else {
      reply.redirect(admin.options.loginPath);
    }
  });
};
