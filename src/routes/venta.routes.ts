import { Router } from 'express';
import * as ventaController from '../controllers/venta.controller';

const router = Router();

router.get('/', ventaController.getAll);
router.get('/:id', ventaController.getById);
router.post('/', ventaController.create);
router.put('/:id', ventaController.update);
router.delete('/:id', ventaController.remove);

export default router; 