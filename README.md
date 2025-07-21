# BD_Tieditas API

API RESTful para la gestión de empleados, marcas, productos, proveedores, pedidos y ventas.

## Tecnologías Utilizadas

- Node.js con TypeScript
- Express.js
- Prisma ORM
- MySQL
- Swagger/OpenAPI para documentación

## Requisitos

- Node.js >= 14.x
- MySQL >= 8.x

## Instalación

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
cd BD_Tieditas
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
Crear un archivo `.env` en la raíz del proyecto con el siguiente contenido:
```
DATABASE_URL=mysql://root:uCpYAFHhmryDdBXFzStvFQDbyIqyqOaD@crossover.proxy.rlwy.net:57061/railway
PORT=3000
```

4. Ejecutar migraciones de la base de datos:
```bash
npm run prisma:migrate
```

## Ejecución

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm run build
npm start
```

## Documentación de la API

La documentación de la API está disponible en la ruta `/api-docs` cuando el servidor está en ejecución.

### Endpoints Principales

#### Empleados
- GET /empleado - Obtener todos los empleados
- GET /empleado/:id - Obtener un empleado por ID
- POST /empleado - Crear un nuevo empleado
- PUT /empleado/:id - Actualizar un empleado
- DELETE /empleado/:id - Eliminar un empleado

#### Marcas
- GET /marca - Obtener todas las marcas
- GET /marca/:id - Obtener una marca por ID
- POST /marca - Crear una nueva marca
- PUT /marca/:id - Actualizar una marca
- DELETE /marca/:id - Eliminar una marca

#### Productos
- GET /producto - Obtener todos los productos
- GET /producto/:id - Obtener un producto por ID
- POST /producto - Crear un nuevo producto
- PUT /producto/:id - Actualizar un producto
- DELETE /producto/:id - Eliminar un producto

#### Proveedores
- GET /proveedor - Obtener todos los proveedores
- GET /proveedor/:id - Obtener un proveedor por ID
- POST /proveedor - Crear un nuevo proveedor
- PUT /proveedor/:id - Actualizar un proveedor
- DELETE /proveedor/:id - Eliminar un proveedor

#### Pedidos
- GET /pedido - Obtener todos los pedidos
- GET /pedido/:id - Obtener un pedido por ID
- POST /pedido - Crear un nuevo pedido
- PUT /pedido/:id - Actualizar un pedido
- DELETE /pedido/:id - Eliminar un pedido

#### Ventas
- GET /venta - Obtener todas las ventas
- GET /venta/:id - Obtener una venta por ID
- POST /venta - Crear una nueva venta
- PUT /venta/:id - Actualizar una venta
- DELETE /venta/:id - Eliminar una venta

## Estructura del Proyecto

```
BD_Tieditas/
├── src/
│   ├── config/
│   │   └── database.ts
│   ├── controllers/
│   │   ├── empleado.controller.ts
│   │   ├── marca.controller.ts
│   │   ├── producto.controller.ts
│   │   └── ...
│   ├── routes/
│   │   ├── empleado.routes.ts
│   │   ├── marca.routes.ts
│   │   ├── producto.routes.ts
│   │   └── ...
│   ├── middlewares/
│   │   └── errorHandler.ts
│   ├── app.ts
│   └── server.ts
├── prisma/
│   └── schema.prisma
├── swagger.json
├── package.json
├── tsconfig.json
└── README.md
``` 