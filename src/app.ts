import express from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json';
import { errorHandler } from './middlewares/errorHandler';
// Importar rutas
import empleadoRoutes from './routes/empleado.routes';
import marcaRoutes from './routes/marca.routes';
import productoRoutes from './routes/producto.routes';
import proveedorRoutes from './routes/proveedor.routes';
import proveedorProductoRoutes from './routes/proveedor_producto.routes';
import pedidoRoutes from './routes/pedido.routes';
import detallesPedidoRoutes from './routes/detalles_pedido.routes';
import ventaRoutes from './routes/venta.routes';
import detallesVentaRoutes from './routes/detalles_venta.routes';

dotenv.config();

const app = express();

app.use(express.json());

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rutas
app.use('/empleado', empleadoRoutes);
app.use('/marca', marcaRoutes);
app.use('/producto', productoRoutes);
app.use('/proveedor', proveedorRoutes);
app.use('/proveedor_producto', proveedorProductoRoutes);
app.use('/pedido', pedidoRoutes);
app.use('/detalles_pedido', detallesPedidoRoutes);
app.use('/venta', ventaRoutes);
app.use('/detalles_venta', detallesVentaRoutes);

// Manejo de errores global
app.use(errorHandler);

export default app; 