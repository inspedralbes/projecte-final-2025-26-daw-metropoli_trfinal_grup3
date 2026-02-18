import express from 'express';
import eventoController from '../controllers/eventoController.js';

const router = express.Router();

/**
 * GET /api/eventos/proximo
 * 
 * Este endpoint es para la CUENTA ATRAS EN EL FRONTEND.
 * Devuelve el proximo evento que va a empezar.
 * 
 * EJEMPLO RESPUESTA (JSON):
 * {
 *   "success": true,
 *   "message": "Proximo evento recuperado",
 *   "data": {
 *     "id_evento": 1,
 *     "nombre": "Gran Premio Metropoli",
 *     "fecha_inicio": "2026-02-18T10:00:00.000Z", // <--- ESTO ES LO IMPORTANTE (Target Date)
 *     "fecha_fin": "2026-02-18T12:00:00.000Z",
 *     "estado": "pendiente"
 *   }
 * }
 * 
 * NOTA PARA FRONTEND:
 * - La logica de los numeros bajando (Cuenta Atras) va 100% en vuestro JS (Cliente).
 * - Teneis que coger 'data.fecha_inicio' y restarle 'new Date()' cada segundo.
 * - Si data es null, es que no hay carreras programadas :D
 */
router.get('/proximo', eventoController.getNextEvento);

router.post('/', eventoController.createEvento);
router.get('/', eventoController.getEventos);

/**
 * PUT /api/eventos/:id
 * 
 * Este endpoint es para el ADMIN (Modificar hora/retrasar carrera).
 * Podeis enviar solo el campo que cambia (Edicion Parcial).
 */
router.put('/:id', eventoController.updateEvento);

export default router;
