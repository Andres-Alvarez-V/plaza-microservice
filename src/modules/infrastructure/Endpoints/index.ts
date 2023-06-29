import express from 'express';
import adminRouter from './admin.routes';

function routes(app: express.Application) {
	const router = express.Router();
	app.get('/', (req, res) => {
		res.send('Hola mi server en express');
	});
	app.use('/api/v1', router);
	router.use('/admin', adminRouter);
}

export default routes;
