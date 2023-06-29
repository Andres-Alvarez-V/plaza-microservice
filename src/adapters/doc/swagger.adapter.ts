import { Application, Request, Response } from 'express';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options: swaggerJsDoc.Options = {
	definition: {
		openapi: '3.0.3',
		info: {
			title: 'Users API - OpenAPI 3.0',
			description: '',
			version: '1.0.0',
		},
	},
	apis: ['./src/modules/infrastructure/Endpoints/*.routes.ts'],
};

const swaggerSpec = swaggerJsDoc(options);

export const swaggerDocs = (app: Application, port: number) => {
	// Swagger page
	app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

	// Docs in JSON format
	app.get('/docs.json', (req: Request, res: Response) => {
		res.setHeader('Content-Type', 'application/json');
		res.send(swaggerSpec);
	});

	console.info(`Docs available at http://localhost:${port}/docs`);
};
