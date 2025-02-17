import AdminJS from 'adminjs';
import { FastifyInstance } from 'fastify';

import { AuthenticationContext, AuthenticationOptions } from '../types.js';

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

  const { provider } = auth;
  const providerProps = provider?.getUiProps?.() ?? {};

  fastifyInstance.get(loginPath, async (req, reply) => {
    const baseProps = {
      action: admin.options.loginPath,
      errorMessage: null,
    };
    const login = await admin.renderLogin({
      ...baseProps,
      ...providerProps,
    });
    reply.type('text/html');
    return reply.send(login);
  });

  fastifyInstance.post(loginPath, async (req, reply) => {
    const context: AuthenticationContext = { request: req, reply };

    let adminUser;
    if (provider) {
      adminUser = await provider.handleLogin(
        {
          headers: req.headers,
          query: req.query ?? {},
          params: req.params ?? {},
          data: req.body ?? {},
        },
        context
      );
    } else {
      const { email, password } = req.body as {
        email: string;
        password: string;
      };
      // "auth.authenticate" must always be defined if "auth.provider" isn't
      adminUser = await auth.authenticate!(email, password, context);
    }

    if (adminUser) {
      req.session.set('adminUser', adminUser);

      if (req.session.redirectTo) {
        return reply.redirect(req.session.redirectTo);
      } else {
        return reply.redirect(rootPath);
      }
    } else {
      const login = await admin.renderLogin({
        action: admin.options.loginPath,
        errorMessage: 'invalidCredentials',
        ...providerProps,
      });
      reply.type('text/html');
      return reply.send(login);
    }
  });
};
