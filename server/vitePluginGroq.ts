import type { Plugin, ViteDevServer, PreviewServer } from 'vite';
import { handleGroqGenerateRequest } from './groqHandler';
import type { IncomingMessage, ServerResponse } from 'node:http';

export function groqApiPlugin(env: Record<string, string>): Plugin {
  const handler = async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    const url = req.url ? req.url.split('?')[0] : '';
    if (url === '/api/generate-excuse' && req.method === 'POST') {
      let bodyData = '';
      req.on('data', (chunk) => {
        bodyData += chunk;
      });
      req.on('end', async () => {
        try {
          const payload = bodyData ? JSON.parse(bodyData) : {};
          const result = await handleGroqGenerateRequest(
            payload,
            env.GROQ_API_KEY || process.env.GROQ_API_KEY,
            env.GROQ_MODEL || process.env.GROQ_MODEL
          );
          res.statusCode = result.status;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(result.body));
        } catch {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              success: false,
              error: 'Invalid JSON payload received in request.',
              code: 'MALFORMED_REQUEST',
            })
          );
        }
      });
      return;
    }
    next();
  };

  return {
    name: 'vite-plugin-groq-api',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server: PreviewServer) {
      server.middlewares.use(handler);
    },
  };
}
