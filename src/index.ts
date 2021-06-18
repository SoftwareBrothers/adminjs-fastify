/* eslint-disable max-len */
// import { buildAuthenticatedRouter } from './buildAuthenticatedRouter';
import { buildRouter } from './buildRouter';
import { buildAuthenticatedRouter } from './buildAuthenticatedRouter';

/**
 * @module @adminjs/fastify
 * @subcategory Plugins
 * @section modules
 *
 * @classdesc
 * Plugin that allows you to add AdminJS to Fastify applications.
 *
 * ## Installation
 *
 * ```sh
 * npm install @adminjs/fastify
 * ```
 *
 * ## Usage
 *
 * ```
 * const AdminJSFastify = require('@adminjs/fastify')
 * ```
 *
 * It exposes 2 methods that create an Express Router, which can be attached
 * to a given url in the API. Each method takes a pre-configured instance of {@link AdminJS}.
 *
 * - {@link module:@adminjs/fastify.buildRouter AdminJSExpress.buildRouter(admin, [predefinedRouter])}
 * - {@link module:@adminjs/fastify.buildAuthenticatedRouter AdminJSExpress.buildAuthenticatedRouter(admin, auth, [predefinedRouter], sessionOptions)}
 *
 * If you want to use a router you have already created - not a problem. Just pass it
 * as a `predefinedRouter` parameter.
 *
 * You may want to use this option when you want to include
 * some custom auth middleware for you AdminJS routes.
 *
 * ## Example without an authentication
 *
 * ```
 * const AdminJS = require('admin-bro')
 * const AdminJSFastify = require('@adminjs/fastify')
 *
 * const fastify = require('fastify')()
 *
 * const AdminJS = new AdminJS({
 *   databases: [],
 *   rootPath: '/admin',
 * })
 *
 * AdminJSFastify.buildRouter(AdminJS)
 * app.listen(8080, () => console.log('AdminJS is under localhost:8080/admin'))
 * ```
 *
 * ## Using build in authentication
 *
 * To protect the routes with a session authentication, you can use predefined
 * {@link module:@adminjs/fastify.buildAuthenticatedRouter} method.
 *
 * Note! To use authentication in production environment, there is a need to configure
 * fastify-session for production build. It can be achieved by passing options to
 * `sessionOptions` parameter.
 *
 * ## Adding custom authentication
 *
 * Where `req.session.admin` is {@link AdminJS#CurrentAdmin},
 * meaning that it should have at least an email property.
 */

/**
 * Plugin name
 * @static
 * @memberof module:@adminjs/fastify
 */
export const name = 'AdminJSFastify';

module.exports = { name, buildRouter, buildAuthenticatedRouter };

export default { name, buildRouter, buildAuthenticatedRouter };

export { AuthenticationOptions } from './types';
