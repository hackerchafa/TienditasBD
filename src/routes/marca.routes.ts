import { Router } from 'express';
import * as marcaController from '../controllers/marca.controller';

const router = Router();

router.get('/', marcaController.getAll);
router.get('/:id', marcaController.getById);
router.post('/', marcaController.create);
router.put('/:id', marcaController.update);
router.delete('/:id', marcaController.remove);

export default router; 