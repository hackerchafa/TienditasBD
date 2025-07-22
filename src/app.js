"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_json_1 = __importDefault(require("../swagger.json"));
const errorHandler_1 = require("./middlewares/errorHandler");
// Importar rutas
const empleado_routes_1 = __importDefault(require("./routes/empleado.routes"));
const marca_routes_1 = __importDefault(require("./routes/marca.routes"));
const producto_routes_1 = __importDefault(require("./routes/producto.routes"));
const proveedor_routes_1 = __importDefault(require("./routes/proveedor.routes"));
const proveedor_producto_routes_1 = __importDefault(require("./routes/proveedor_producto.routes"));
const pedido_routes_1 = __importDefault(require("./routes/pedido.routes"));
const detalles_pedido_routes_1 = __importDefault(require("./routes/detalles_pedido.routes"));
const venta_routes_1 = __importDefault(require("./routes/venta.routes"));
const detalles_venta_routes_1 = __importDefault(require("./routes/detalles_venta.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Documentación Swagger
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
// Rutas
app.use('/empleado', empleado_routes_1.default);
app.use('/marca', marca_routes_1.default);
app.use('/producto', producto_routes_1.default);
app.use('/proveedor', proveedor_routes_1.default);
app.use('/proveedor_producto', proveedor_producto_routes_1.default);
app.use('/pedido', pedido_routes_1.default);
app.use('/detalles_pedido', detalles_pedido_routes_1.default);
app.use('/venta', venta_routes_1.default);
app.use('/detalles_venta', detalles_venta_routes_1.default);
// Manejo de errores global
app.use(errorHandler_1.errorHandler);
exports.default = app;
