import AdminJS, { CurrentAdmin, Router as AdminRouter } from 'adminjs';
import { FastifyInstance } from 'fastify';

export const withProtectedRoutesHandler = (
  fastifyApp: FastifyInstance,
  admin: AdminJS
): void => {
  const { rootPath } = admin.options;

  fastifyApp.addHook("preHandler", async (request, reply) => {
    const buildComponentRoute = AdminRouter.routes.find(
      (r) => r.action === "bundleComponents"
    )?.path;

    let AdminOptionsAssets = admin.options?.assets ?? {};
    if (typeof AdminOptionsAssets === 'function')
      AdminOptionsAssets = await AdminOptionsAssets(request.session.get('adminUser') as CurrentAdmin);
    const assets = [
      ...AdminRouter.assets.map((a) => a.path),
      ...Object.values(AdminOptionsAssets).flat(),
    ];

    if (assets.find((a) => typeof a === 'string' && request.url.match(a))) {
      return;
    } else if (buildComponentRoute && request.url.match(buildComponentRoute)) {
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

      return reply.redirect(admin.options.loginPath);
    }
  });
};
