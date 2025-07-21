import { Router } from 'express';
import * as pedidoController from '../controllers/pedido.controller';

const router = Router();

router.get('/', pedidoController.getAll);
router.get('/:id', pedidoController.getById);
router.post('/', pedidoController.create);
router.put('/:id', pedidoController.update);
router.delete('/:id', pedidoController.remove);

export default router; 