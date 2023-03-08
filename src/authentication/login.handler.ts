import AdminJS from 'adminjs';
import { FastifyInstance } from 'fastify';
import { AuthenticationOptions } from '../types.js';

const getLoginPath = (admin: AdminJS): string => {
  const { loginPath } = admin.options;

  return loginPath.startsWith('/') ? loginPath : `/${loginPath}`;
};

export const withLogin = (
  fastifyInstance: FastifyInstance,
  admin: AdminJS,
  auth: AuthenticationOptions
): void => {
  const { rootPath } = admin.options;
  const loginPath = getLoginPath(admin);

  fastifyInstance.get(loginPath, async (req, reply) => {
    const login = await admin.renderLogin({
      action: admin.options.loginPath,
      errorMessage: null,
    });
    reply.type('text/html');
    reply.send(login);
  });

  fastifyInstance.post(loginPath, async (req, reply) => {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };
    const adminUser = await auth.authenticate(email, password);
    if (adminUser) {
      req.session.set('adminUser', adminUser);

      if (req.session.redirectTo) {
        reply.redirect(302, req.session.redirectTo);
      } else {
        reply.redirect(302, rootPath);
      }
    } else {
      const login = await admin.renderLogin({
        action: admin.options.loginPath,
        errorMessage: 'invalidCredentials',
      });
      reply.type('text/html');
      reply.send(login);
    }
  });
};
