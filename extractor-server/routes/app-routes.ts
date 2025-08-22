import { Router } from 'express';
import processRouter from './process.ts';

const appRoutes: Router = Router();

appRoutes.use('/process', processRouter);

export default appRoutes;
