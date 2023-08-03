import express from 'express';
import adminRouter from './admin.routes';
import ownerRouter from './owner.routes';
import clientRouter from './client.routes';
import employeeRouter from './employee.routes';

function routes(app: express.Application) {
	const router = express.Router();
	app.get('/', (req, res) => {
		console.log(req.headers)
		res.send('Hola mi server en express');
	});
	app.use('/api/v1', router);
	router.use('/admin', adminRouter);
	router.use('/propietario', ownerRouter);
	router.use('/cliente', clientRouter);
	router.use('/empleado', employeeRouter);
}

export default routes;
