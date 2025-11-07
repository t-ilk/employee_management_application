import {legacyPlugin} from '@web/dev-server-legacy';


export default {
  nodeResolve: ['development'],
  preserveSymlinks: true,
  appIndex: 'index.html',
  // Handle SPA routing - serve index.html for all non-file routes
  middleware: [
    function rewriteIndex(context, next) {
      if (context.url !== '/' && !context.url.includes('.')) {
        context.url = '/';
      }
      return next();
    },
  ],
  plugins: [
    legacyPlugin({
      polyfills: {
        // Manually imported in index.html file
        webcomponents: false,
      },
    }),
  ],
};
