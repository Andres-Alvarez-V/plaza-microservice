import { Application, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import * as swaggerJSON from './swagger.json';

export const swaggerDocs = (app: Application, port: number) => {
	// Swagger page
	app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerJSON));

	// Docs in JSON format
	app.get('/docs.json', (req: Request, res: Response) => {
		res.setHeader('Content-Type', 'application/json');
		res.send(swaggerJSON);
	});

	console.info(`Docs available at http://localhost:${port}/docs`);
};
