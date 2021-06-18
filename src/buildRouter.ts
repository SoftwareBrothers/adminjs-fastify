import AdminJS, { Router as AdminRouter } from 'admin-bro';
import path from 'path';
import { WrongArgumentError } from './errors';
import { log } from './logger';
import { FastifyInstance } from 'fastify';
import { RouteHandlerMethod } from 'fastify/types/route';
import fastifySession from 'fastify-session';
import fastifyCookie from 'fastify-cookie';
import { fromPairs } from 'lodash';
import * as fs from 'fs';

import fastifyMultipart from 'fastify-multipart';

import { pipeline } from 'stream';

import util from 'util';

const pump = util.promisify(pipeline);

const INVALID_ADMIN_BRO_INSTANCE =
  'You have to pass an instance of AdminJS to the buildRouter() function';

export const buildRouter = (
  admin: AdminJS,
  fastifyApp: FastifyInstance
): void => {
  if (admin?.constructor?.name !== 'AdminBro') {
    throw new WrongArgumentError(INVALID_ADMIN_BRO_INSTANCE);
  }

  fastifyApp.register(fastifyMultipart, { attachFieldsToBody: true });
  fastifyApp.register(fastifyCookie);
  fastifyApp.register(fastifySession, {
    secret: 'a secret with minimum length of 32 characters',
  });

  admin.initialize().then(() => {
    log.debug('AdminJS: bundle ready');
  });

  const { routes, assets } = AdminRouter;

  routes.forEach(route => {
    // we have to change routes defined in AdminJS from {recordId} to :recordId
    const path = route.path.replace(/{/g, ':').replace(/}/g, '');

    const handler: RouteHandlerMethod = async (request, reply) => {
      const controller = new route.Controller(
        { admin },
        request.session && request.session.adminUser
      );
      const { params, query } = request;
      const method = request.method.toLowerCase();

      const body = request.body as Record<string, { value: string }>;
      const fields = fromPairs(
        Object.keys((body ?? {}) as Record<string, unknown>).map(key => [
          key,
          body[key].value,
        ])
      );
      const payload = {
        ...(fields || {}),
        // ...(request.files || {}),
      };
      const html = await controller[route.action](
        {
          ...request,
          params,
          query,
          payload,
          method,
        },
        reply
      );

      if (route.contentType) {
        reply.type(route.contentType);
      } else if (typeof html === 'string') {
        reply.type('text/html');
      }
      if (html) {
        reply.send(html);
      }
    };

    if (route.method === 'GET') {
      fastifyApp.get(`${admin.options.rootPath}${path}`, handler);
    }

    if (route.method === 'POST') {
      fastifyApp.post(`${admin.options.rootPath}${path}`, handler);
    }
  });

  assets.forEach(asset => {
    fastifyApp.get(
      `${admin.options.rootPath}${asset.path}`,
      async (req, res) => {
        res.send(fs.createReadStream(path.resolve(asset.src)));
      }
    );
  });
};
