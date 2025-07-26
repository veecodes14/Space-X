"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const rocket_controller_1 = require("../controllers/rocket.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const rocket_validator_1 = require("../validators/rocket.validator");
const validate_request_1 = require("../middlewares/validate.request");
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
 *               - model
 *               - fuelCapacity
 *             properties:
 *               name:
 *                 type: string
 *                 example: Falcon 9
 *               model:
 *                 type: string
 *                 example: SpaceX-F9
 *               fuelCapacity:
 *                 type: number
 *                 example: 5000
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
router.post('/add', auth_middleware_1.authMiddleware, (0, role_middleware_1.authorizedRoles)("admin"), rocket_validator_1.validateAddRocket, validate_request_1.validateRequest, rocket_controller_1.addRocket);
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
 *               model:
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
router.patch('/:id/update', auth_middleware_1.authMiddleware, (0, role_middleware_1.authorizedRoles)("admin"), rocket_validator_1.validateUpdateRocket, validate_request_1.validateRequest, rocket_controller_1.updateRocket);
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
router.get('/fetch', auth_middleware_1.authMiddleware, (0, role_middleware_1.authorizedRoles)("admin"), rocket_controller_1.getRockets);
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
router.delete('/:id/delete', auth_middleware_1.authMiddleware, (0, role_middleware_1.authorizedRoles)("admin"), rocket_controller_1.deleteRocket);
exports.default = router;
