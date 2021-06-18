export const log = {
  /**
   * Logs the debug message to console if `process.env.ADMIN_BRO_FASTIFY_DEBUG` is set
   */
  debug: (message: string): void => {
    if (process.env.ADMIN_BRO_FASTIFY_DEBUG) {
      console.debug(message);
    }
  },
};
