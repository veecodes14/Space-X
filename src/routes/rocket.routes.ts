import express from 'express';
const router = express.Router();
import {addRocket, updateRocket, deleteRocket, getRockets} from "../controllers/rocket.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorizedRoles } from "../middlewares/role.middleware";
import { validateAddRocket, validateUpdateRocket } from '../validators/rocket.validator';
import { validateRequest } from '../middlewares/validate.request';


/**
 * @route POST /api/v1/rockets/request
 * @desc Admin adds rocket(admin only)
 * @access Private
 */
router.post('/add', authMiddleware, authorizedRoles("admin"), validateAddRocket, validateRequest, addRocket);

/** 
//@route PATCH /api/v1/rockets/:id/update
//@desc Admin updates rocket info (admin only)
//@access Private
*/
router.patch('/:id/update', authMiddleware, authorizedRoles("admin"), validateUpdateRocket, validateRequest, updateRocket);

/** 
//@route GET /api/v1/rockets/fetch
//@desc Admin fetches rockets (admin only), (status change to completed)
//@access Private
*/
router.get('/fetch', authMiddleware, authorizedRoles("admin"), getRockets);

/**
//@route DELETE /api/v1/rockets/:id/delete
//@desc Driver completes ride (driver only), (status change to completed)
//@access Private
*/
router.delete('/:id/delete', authMiddleware, authorizedRoles("admin"), deleteRocket);


export default router;