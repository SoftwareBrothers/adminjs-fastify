import AdminJS, { Router as AdminRouter } from 'adminjs';
import { FastifyInstance } from 'fastify';

export const withProtectedRoutesHandler = (
  fastifyApp: FastifyInstance,
  admin: AdminJS
): void => {
  const { rootPath } = admin.options;

  fastifyApp.addHook('preHandler', async (request, reply) => {    
    if (AdminRouter.assets.find((asset) => request.url.match(asset.path))) {
      return;
    } else if (request.url.match(AdminRouter.routes.find((r) => r.action === 'bundleComponents').path) {
      return;
    } else if (
      !request.url.startsWith(rootPath) ||
      request.session.get('adminUser') ||
      // these routes don't need authentication
      request.url.startsWith(admin.options.loginPath) ||
      request.url.startsWith(admin.options.logoutPath)
    ) {
      return;
    } else {
      // If the redirection is caused by API call to some action just redirect to resource
      const [redirectTo] = request.url.split('/actions');
      request.session.redirectTo = redirectTo.includes(`${rootPath}/api`)
        ? rootPath
        : redirectTo;

      reply.redirect(admin.options.loginPath);
    }
  });
};
