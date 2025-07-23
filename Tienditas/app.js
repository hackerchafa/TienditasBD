// --- Utilidades de UI ---
// Esta función muestra la sección seleccionada y oculta las demás
function showSection(id) {
  document.querySelectorAll('main section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if (id === 'dashboard') updateDashboard();
  if (id === 'productos') renderProductos();
  if (id === 'ventas') {
    renderVentas();
    updateVentaSelect();
    setFechaVentaAhora();
  }
  if (id === 'proveedores') renderProveedores();
  if (id === 'empleados') renderEmpleados();
  if (id === 'reportes') renderReportes();
}

// --- Persistencia local con localStorage ---
function guardarDatos() {
  localStorage.setItem('tienditas_productos', JSON.stringify(productos));
  localStorage.setItem('tienditas_ventas', JSON.stringify(ventas));
  localStorage.setItem('tienditas_proveedores', JSON.stringify(proveedores));
  localStorage.setItem('tienditas_empleados', JSON.stringify(empleados));
}
function cargarDatos() {
  productos = JSON.parse(localStorage.getItem('tienditas_productos') || '[]');
  ventas = JSON.parse(localStorage.getItem('tienditas_ventas') || '[]');
  proveedores = JSON.parse(localStorage.getItem('tienditas_proveedores') || '[]');
  empleados = JSON.parse(localStorage.getItem('tienditas_empleados') || '[]');
}

// --- Datos en memoria (se inicializan con localStorage) ---
let productos = [];
let ventas = [];
let proveedores = [];
let empleados = [];

// Cargar datos al iniciar
cargarDatos();

// --- Estado para edición de productos ---
let editandoProducto = null; // Si es null, es alta nueva. Si es un índice, es edición.
// --- Estado para edición de ventas, proveedores y empleados ---
let editandoVenta = null;
let editandoProveedor = null;
let editandoEmpleado = null;

// --- Productos ---
document.getElementById('form-producto').onsubmit = function(e) {
  e.preventDefault();
  const nombre = document.getElementById('prod-nombre').value.trim();
  const precio = parseInt(document.getElementById('prod-precio').value);
  const cantidad = parseInt(document.getElementById('prod-cantidad').value);
  const caducidad = document.getElementById('prod-caducidad').value;
  const marca = document.getElementById('prod-marca').value;
  // Validación extra: solo letras en nombre
  if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/.test(nombre)) {
    alert('El nombre solo puede contener letras y espacios.');
    return;
  }
  if (!Number.isInteger(precio) || precio < 0) {
    alert('El precio debe ser un número entero positivo.');
    return;
  }
  if (!Number.isInteger(cantidad) || cantidad < 0) {
    alert('La cantidad debe ser un número entero positivo.');
    return;
  }
  // Validación de caducidad: no permitir fechas pasadas
  if (caducidad) {
    const hoy = new Date();
    hoy.setHours(0,0,0,0);
    const fechaCad = new Date(caducidad);
    if (fechaCad < hoy) {
      alert('La fecha de caducidad no puede ser pasada.');
      return;
    }
  }
  if (editandoProducto !== null) {
    productos[editandoProducto] = { nombre, precio, cantidad, caducidad, marca };
    editandoProducto = null;
    this.querySelector('button[type="submit"]').textContent = 'Agregar Producto';
  } else {
    // Buscar si ya existe un producto con el mismo nombre y precio
    const idx = productos.findIndex(p => p.nombre.toLowerCase() === nombre.toLowerCase() && p.precio === precio);
    if (idx !== -1) {
      // Si existe, sumar cantidades
      productos[idx].cantidad += cantidad;
      // Si la marca es diferente y no está vacía, la actualiza (opcional)
      if (marca && productos[idx].marca !== marca) {
        productos[idx].marca = marca;
      }
      // Si la caducidad es diferente y no está vacía, la actualiza (opcional)
      if (caducidad && productos[idx].caducidad !== caducidad) {
        productos[idx].caducidad = caducidad;
      }
    } else {
      productos.push({ nombre, precio, cantidad, caducidad, marca });
    }
  }
  this.reset();
  guardarDatos();
  renderProductos();
  updateVentaSelect();
};
function renderProductos() {
  const tabla = document.getElementById('tabla-productos');
  tabla.innerHTML = `<tr>
    <th>Nombre</th><th>Precio</th><th>Cantidad</th><th>Caducidad</th><th>Marca</th><th>Acciones</th>
  </tr>` + productos.map((p, i) =>
    `<tr>
      <td>${p.nombre}</td>
      <td>$${p.precio}</td>
      <td>${p.cantidad}</td>
      <td>${p.caducidad || '-'}</td>
      <td>${p.marca || '-'}</td>
      <td>
        <button onclick="editarProducto(${i})">Editar</button>
        <button onclick="eliminarProducto(${i})">Eliminar</button>
      </td>
    </tr>`
  ).join('');
}
// Función para cargar los datos de un producto en el formulario para editar
window.editarProducto = function(i) {
  const p = productos[i];
  document.getElementById('prod-nombre').value = p.nombre;
  document.getElementById('prod-precio').value = p.precio;
  document.getElementById('prod-cantidad').value = p.cantidad;
  document.getElementById('prod-caducidad').value = p.caducidad || '';
  document.getElementById('prod-marca').value = p.marca;
  editandoProducto = i;
  document.querySelector('#form-producto button[type="submit"]').textContent = 'Guardar Cambios';
  showSection('productos');
};
// Función para eliminar un producto
window.eliminarProducto = function(i) {
  if (confirm('¿Seguro que quieres eliminar este producto?')) {
    productos.splice(i, 1);
    guardarDatos();
    renderProductos();
    updateVentaSelect();
  }
};

// --- Ventas ---
document.getElementById('form-venta').onsubmit = function(e) {
  e.preventDefault();
  // Fecha y hora automática
  const fecha = new Date().toLocaleString('es-MX', { hour12: false });
  document.getElementById('venta-fecha').value = fecha;
  const prodIdx = document.getElementById('venta-producto').value;
  const cantidad = parseInt(document.getElementById('venta-cantidad').value);
  const metodo = document.getElementById('venta-metodo').value;
  const pago = parseInt(document.getElementById('venta-pago').value) || 0;
  const producto = productos[prodIdx];
  if (!producto || cantidad < 1) {
    alert('La cantidad debe ser mayor a 0.');
    return;
  }
  if (!Number.isInteger(pago) || pago < 0) {
    alert('El pago debe ser un número entero positivo.');
    return;
  }
  if (producto.cantidad < cantidad) {
    alert('No hay suficiente inventario');
    return;
  }
  if (editandoVenta !== null) {
    const ventaAnterior = ventas[editandoVenta];
    const idxAnterior = productos.findIndex(p => p.nombre === ventaAnterior.producto);
    if (idxAnterior !== -1) {
      productos[idxAnterior].cantidad += ventaAnterior.cantidad;
    }
    producto.cantidad -= cantidad;
    ventas[editandoVenta] = { fecha, producto: producto.nombre, cantidad, total: producto.precio * cantidad, metodo, cambio: pago > 0 ? (pago - producto.precio * cantidad) : 0 };
    editandoVenta = null;
    this.querySelector('button[type="submit"]').textContent = 'Registrar Venta';
  } else {
    producto.cantidad -= cantidad;
    const total = producto.precio * cantidad;
    const cambio = pago > 0 ? (pago - total) : 0;
    ventas.push({ fecha, producto: producto.nombre, cantidad, total, metodo, cambio });
  }
  this.reset();
  guardarDatos();
  renderVentas();
  renderProductos();
  updateDashboard();
};
function updateVentaSelect() {
  const select = document.getElementById('venta-producto');
  select.innerHTML = productos.map((p, i) =>
    `<option value="${i}">${p.nombre} ($${p.precio})</option>`
  ).join('');
}
function renderVentas() {
  const tabla = document.getElementById('tabla-ventas');
  tabla.innerHTML = `<tr>
    <th>Fecha</th><th>Producto</th><th>Cantidad</th><th>Total</th><th>Método</th><th>Cambio</th><th>Acciones</th>
  </tr>` + ventas.map((v, i) =>
    `<tr>
      <td>${v.fecha}</td>
      <td>${v.producto}</td>
      <td>${v.cantidad}</td>
      <td>$${v.total.toFixed(2)}</td>
      <td>${v.metodo}</td>
      <td>$${v.cambio.toFixed(2)}</td>
      <td>
        <button onclick="editarVenta(${i})">Editar</button>
        <button onclick="eliminarVenta(${i})">Eliminar</button>
      </td>
    </tr>`
  ).join('');
}
window.editarVenta = function(i) {
  const v = ventas[i];
  document.getElementById('venta-fecha').value = v.fecha;
  const idx = productos.findIndex(p => p.nombre === v.producto);
  document.getElementById('venta-producto').value = idx;
  document.getElementById('venta-cantidad').value = v.cantidad;
  document.getElementById('venta-metodo').value = v.metodo;
  document.getElementById('venta-pago').value = Math.round(v.cambio + v.total);
  editandoVenta = i;
  document.querySelector('#form-venta button[type="submit"]').textContent = 'Guardar Cambios';
  showSection('ventas');
};
window.eliminarVenta = function(i) {
  if (confirm('¿Seguro que quieres eliminar esta venta?')) {
    // Al eliminar, reponer la cantidad al inventario
    const venta = ventas[i];
    const idx = productos.findIndex(p => p.nombre === venta.producto);
    if (idx !== -1) {
      productos[idx].cantidad += venta.cantidad;
    }
    ventas.splice(i, 1);
    guardarDatos();
    renderVentas();
    renderProductos();
    updateDashboard();
  }
};

// --- Proveedores ---
document.getElementById('form-proveedor').onsubmit = function(e) {
  e.preventDefault();
  const nombre = document.getElementById('prov-nombre').value.trim();
  const telefono = document.getElementById('prov-telefono').value.trim();
  const productosProv = document.getElementById('prov-productos').value.trim();
  const frecuencia = document.getElementById('prov-frecuencia').value;
  // Validar teléfono solo números
  if (!/^[0-9]+$/.test(telefono)) {
    alert('El teléfono solo puede contener números.');
    return;
  }
  // Validar productos que surte solo letras y comas
  if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ,]+$/.test(productosProv)) {
    alert('Productos que surte solo puede contener letras, espacios y comas.');
    return;
  }
  if (editandoProveedor !== null) {
    proveedores[editandoProveedor] = { nombre, telefono, productos: productosProv, frecuencia };
    editandoProveedor = null;
    this.querySelector('button[type="submit"]').textContent = 'Agregar Proveedor';
  } else {
    proveedores.push({ nombre, telefono, productos: productosProv, frecuencia });
  }
  this.reset();
  guardarDatos();
  renderProveedores();
};
function renderProveedores() {
  const tabla = document.getElementById('tabla-proveedores');
  tabla.innerHTML = `<tr>
    <th>Nombre</th><th>Teléfono</th><th>Productos</th><th>Frecuencia</th><th>Acciones</th>
  </tr>` + proveedores.map((p, i) =>
    `<tr>
      <td>${p.nombre}</td>
      <td>${p.telefono}</td>
      <td>${p.productos}</td>
      <td>${p.frecuencia}</td>
      <td>
        <button onclick="editarProveedor(${i})">Editar</button>
        <button onclick="eliminarProveedor(${i})">Eliminar</button>
      </td>
    </tr>`
  ).join('');
}
window.editarProveedor = function(i) {
  const p = proveedores[i];
  document.getElementById('prov-nombre').value = p.nombre;
  document.getElementById('prov-telefono').value = p.telefono;
  document.getElementById('prov-productos').value = p.productos;
  document.getElementById('prov-frecuencia').value = p.frecuencia;
  editandoProveedor = i;
  document.querySelector('#form-proveedor button[type="submit"]').textContent = 'Guardar Cambios';
  showSection('proveedores');
};
window.eliminarProveedor = function(i) {
  if (confirm('¿Seguro que quieres eliminar este proveedor?')) {
    proveedores.splice(i, 1);
    guardarDatos();
    renderProveedores();
  }
};

// --- Empleados ---
document.getElementById('form-empleado').onsubmit = function(e) {
  e.preventDefault();
  const nombre = document.getElementById('emp-nombre').value.trim();
  const turno = document.getElementById('emp-turno').value.trim();
  const direccion = document.getElementById('emp-direccion').value;
  const telefono = document.getElementById('emp-telefono').value;
  // Validar nombre y turno solo letras
  if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/.test(nombre)) {
    alert('El nombre solo puede contener letras y espacios.');
    return;
  }
  if (turno && !/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/.test(turno)) {
    alert('El turno solo puede contener letras y espacios.');
    return;
  }
  if (editandoEmpleado !== null) {
    empleados[editandoEmpleado] = { nombre, turno, direccion, telefono };
    editandoEmpleado = null;
    this.querySelector('button[type="submit"]').textContent = 'Agregar Empleado';
  } else {
    empleados.push({ nombre, turno, direccion, telefono });
  }
  this.reset();
  guardarDatos();
  renderEmpleados();
};
function renderEmpleados() {
  const tabla = document.getElementById('tabla-empleados');
  tabla.innerHTML = `<tr>
    <th>Nombre</th><th>Turno</th><th>Dirección</th><th>Teléfono</th><th>Acciones</th>
  </tr>` + empleados.map((e, i) =>
    `<tr>
      <td>${e.nombre}</td>
      <td>${e.turno}</td>
      <td>${e.direccion}</td>
      <td>${e.telefono}</td>
      <td>
        <button onclick="editarEmpleado(${i})">Editar</button>
        <button onclick="eliminarEmpleado(${i})">Eliminar</button>
      </td>
    </tr>`
  ).join('');
}
window.editarEmpleado = function(i) {
  const e = empleados[i];
  document.getElementById('emp-nombre').value = e.nombre;
  document.getElementById('emp-turno').value = e.turno;
  document.getElementById('emp-direccion').value = e.direccion;
  document.getElementById('emp-telefono').value = e.telefono;
  editandoEmpleado = i;
  document.querySelector('#form-empleado button[type="submit"]').textContent = 'Guardar Cambios';
  showSection('empleados');
};
window.eliminarEmpleado = function(i) {
  if (confirm('¿Seguro que quieres eliminar este empleado?')) {
    empleados.splice(i, 1);
    guardarDatos();
    renderEmpleados();
  }
};

// --- Dashboard y Reportes ---
function updateDashboard() {
  const totalVentas = ventas.reduce((sum, v) => sum + v.total, 0);
  const totalProductos = productos.length;
  document.getElementById('resumen-dia').innerHTML = `
    <p><strong>Ventas del día:</strong> $${totalVentas.toFixed(2)}</p>
    <p><strong>Productos en inventario:</strong> ${totalProductos}</p>
    <p><strong>Proveedores registrados:</strong> ${proveedores.length}</p>
    <p><strong>Empleados registrados:</strong> ${empleados.length}</p>
  `;
}
function renderReportes() {
  // Ganancias por día
  const gananciasPorDia = {};
  ventas.forEach(v => {
    if (!gananciasPorDia[v.fecha]) gananciasPorDia[v.fecha] = 0;
    gananciasPorDia[v.fecha] += v.total;
  });
  document.getElementById('reporte-ganancias').innerHTML =
    `<h3>Ganancias por día</h3>` +
    Object.entries(gananciasPorDia).map(([fecha, total]) =>
      `<p>${fecha}: $${total.toFixed(2)}</p>`
    ).join('');

  // Inventario bajo (menos o igual a 5)
  const bajo = productos.filter(p => p.cantidad <= 5);
  document.getElementById('reporte-inventario-bajo').innerHTML =
    `<h3>Inventario bajo</h3>` +
    (bajo.length ? bajo.map(p => `<p>${p.nombre}: ${p.cantidad}</p>`).join('') : '<p>Todo bien</p>');

  // Productos próximos a caducar (menos de 7 días)
  const hoy = new Date();
  const proximos = productos.filter(p => {
    if (!p.caducidad) return false;
    const cad = new Date(p.caducidad);
    const diff = (cad - hoy) / (1000 * 60 * 60 * 24);
    return diff <= 7 && diff >= 0;
  });
  document.getElementById('reporte-caducidad').innerHTML =
    `<h3>Próximos a caducar (7 días)</h3>` +
    (proximos.length ? proximos.map(p => `<p>${p.nombre}: ${p.caducidad}</p>`).join('') : '<p>Ninguno</p>');
}

// Al cargar la página, poner la fecha y hora actual en el campo de venta
function setFechaVentaAhora() {
  document.getElementById('venta-fecha').value = new Date().toLocaleString('es-MX', { hour12: false });
}
document.addEventListener('DOMContentLoaded', function() {
  showSection('dashboard');
  renderProductos();
  renderVentas();
  renderProveedores();
  renderEmpleados();
  updateVentaSelect();
  updateDashboard();
  renderReportes();
  setFechaVentaAhora();
});
// Al cambiar de sección a ventas, actualizar la fecha automáticamente
window.showSection = function(id) {
  document.querySelectorAll('main section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if (id === 'dashboard') updateDashboard();
  if (id === 'productos') renderProductos();
  if (id === 'ventas') {
    renderVentas();
    updateVentaSelect();
    setFechaVentaAhora();
  }
  if (id === 'proveedores') renderProveedores();
  if (id === 'empleados') renderEmpleados();
  if (id === 'reportes') renderReportes();
}; 