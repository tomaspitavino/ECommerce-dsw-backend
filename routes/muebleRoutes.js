const express = require('express');
const router = express.Router();
const {
  crearMueble,
  obtenerTodosMuebles,
  obtenerMueble,
  actualizarMueble,
  eliminarMueble,
  filtrarMuebles
} = require('../controllers/muebleController');
const { validarMueble } = require('../middlewares/validators');

// CRUD básico
router.post('/', validarMueble, crearMueble);
router.get('/', obtenerTodosMuebles);
router.get('/:codigo', obtenerMueble);
router.put('/:codigo', validarMueble, actualizarMueble);
router.delete('/:codigo', eliminarMueble);

// Filtrado (cumple con el requisito de listado filtrado)
router.get('/filtrar/categoria', filtrarMuebles);
router.get('/filtrar/etiqueta', filtrarMuebles);

module.exports = router;
