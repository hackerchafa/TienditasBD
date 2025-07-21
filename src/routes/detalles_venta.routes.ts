import { Router } from 'express';
import * as detallesVentaController from '../controllers/detalles_venta.controller';

const router = Router();

router.get('/', detallesVentaController.getAll);
router.get('/:id', detallesVentaController.getById);
router.post('/', detallesVentaController.create);
router.put('/:id', detallesVentaController.update);
router.delete('/:id', detallesVentaController.remove);

export default router; 