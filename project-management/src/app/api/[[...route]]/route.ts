import {Hono} from 'hono';
import { handle } from 'hono/vercel';

/**
 * Initializes a new instance of the Hono application and sets the base path for all routes to '/api'.
 * 
 * This means that all routes registered with this app will be prefixed with '/api'.
 * For example, a route defined as `/users` will be accessible at `/api/users`.
 *
 * This code creates a Hono app instance and configures it to use '/api' as the base path for all endpoints.
 */
const app = new Hono().basePath('/api');

app.get('/hello',(c) => {
    return c.json({
        message: 'Hello, this is a test route!',
        timestamp: new Date().toISOString()
    })
})

app.get('/project/:projectId',(c) => {
    const { projectId } = c.req.param();

    return c.json({
        message: `Hello, this is a project route!`,
        projectId: projectId,
        timestamp: new Date().toISOString()
    })
})

export const GET = handle(app);