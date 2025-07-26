import express from 'express';
const router = express.Router();
import {addRocket, updateRocket, deleteRocket, getRockets} from "../controllers/rocket.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorizedRoles } from "../middlewares/role.middleware";
import { validateAddRocket, validateUpdateRocket } from '../validators/rocket.validator';
import { validateRequest } from '../middlewares/validate.request';



/**
 * @swagger
 * /api/v1/rockets/add:
 *   post:
 *     summary: Add a new rocket
 *     tags: [Rockets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - rocketModel
 *               - fuelCapacity
 *               - active
 *             properties:
 *               name:
 *                 type: string
 *                 example: Falcon 9
 *               rocketModel:
 *                 type: string
 *                 example: SpaceX-F9
 *               fuelCapacity:
 *                 type: number
 *                 example: 5000
 *               active:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Rocket added successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
/**
 * @route POST /api/v1/rockets/add
 * @desc Admin adds rocket(admin only)
 * @access Private
 */
router.post('/add', authMiddleware, authorizedRoles("admin"), validateAddRocket, validateRequest, addRocket);


/**
 * @swagger
 * /api/v1/rockets/:id/update:
 *   patch:
 *     summary: Update rocket information
 *     tags: [Rockets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Rocket ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               rocketModel:
 *                 type: string
 *               fuelCapacity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Rocket updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Rocket not found
 *       401:
 *         description: Unauthorized
 */
/** 
//@route PATCH /api/v1/rockets/:id/update
//@desc Admin updates rocket info (admin only)
//@access Private
*/
router.patch('/:id/update', authMiddleware, authorizedRoles("admin"), validateUpdateRocket, validateRequest, updateRocket);


/**
 * @swagger
 * /api/v1/rockets/fetch:
 *   get:
 *     summary: Fetch all rockets
 *     tags: [Rockets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of rockets
 *       401:
 *         description: Unauthorized
 */
/** 
//@route GET /api/v1/rockets/fetch
//@desc Admin fetches rockets (admin only), (status change to completed)
//@access Private
*/
router.get('/fetch', authMiddleware, authorizedRoles("admin"), getRockets);


/**
 * @swagger
 * /api/v1/rockets/:id/delete:
 *   delete:
 *     summary: Delete a rocket
 *     tags: [Rockets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Rocket ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rocket deleted successfully
 *       404:
 *         description: Rocket not found
 *       401:
 *         description: Unauthorized
 */
/**
//@route DELETE /api/v1/rockets/:id/delete
//@desc Admin deletes rocket (admin only)
//@access Private
*/
router.delete('/:id/delete', authMiddleware, authorizedRoles("admin"), deleteRocket);


export default router;