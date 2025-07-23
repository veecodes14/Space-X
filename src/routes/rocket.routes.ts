import express from 'express';
const router = express.Router();
import {addRocket, updateRocket, deleteRocket, getRockets} from "../controllers/rocket.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorizedRoles } from "../middlewares/role.middleware";


/**
 * @route POST /api/v1/rockets/request
 * @desc User Request ride(rider only)
 * @access Private
 */
router.post('/request', authMiddleware, authorizedRoles("admin"), addRocket);

//@route GET /api/v1/rockets/:id/update
//@desc Driver views all pending rides (driver only), Fetch all new rides (pending)
//@access Private
router.patch('/:id/update', authMiddleware, authorizedRoles("admin"), updateRocket);

//@route PATCH /api/v1/rockets/fetch
//@desc Driver completes ride (driver only), (status change to completed)
//@access Private
router.get('/fetch', authMiddleware, authorizedRoles("admin"), getRockets);

//@route PATCH /api/v1/rockets/:id/delete
//@desc Driver completes ride (driver only), (status change to completed)
//@access Private
router.delete('/:id/delete', authMiddleware, authorizedRoles("admin"), deleteRocket);


export default router;