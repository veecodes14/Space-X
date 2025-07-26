"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const mission_controller_1 = require("../controllers/mission.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const mission_validator_1 = require("../validators/mission.validator");
const validate_request_1 = require("../middlewares/validate.request");
/**
 * @swagger
 * /api/v1/missions/schedule:
 *   post:
 *     summary: Schedule a new mission
 *     tags: [Missions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rocketId
 *               - destination
 *               - launchDate
 *             properties:
 *               rocketId:
 *                 type: string
 *                 example: 64f28abc23d1b1b9dc3c8e73
 *               destination:
 *                 type: string
 *                 example: Mars
 *               launchDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-08-01T12:00:00Z
 *     responses:
 *       201:
 *         description: Mission scheduled successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
/**
 * @route POST /api/v1/missions/schedule
 * @desc User Schedule mission(admin and user)
 * @access Private
 */
router.post('/schedule', auth_middleware_1.authMiddleware, (0, role_middleware_1.authorizedRoles)("admin", "user"), mission_validator_1.validateScheduleMission, validate_request_1.validateRequest, mission_controller_1.scheduleMission);
/**
 * @swagger
 * /api/v1/missions/:
 *   post:
 *     summary: Schedule a new mission
 *     tags: [Missions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rocketId
 *               - destination
 *               - launchDate
 *             properties:
 *               rocketId:
 *                 type: string
 *                 example: 64f28abc23d1b1b9dc3c8e73
 *               destination:
 *                 type: string
 *                 example: Mars
 *               launchDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-08-01T12:00:00Z
 *     responses:
 *       201:
 *         description: Mission scheduled successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
/**
//@route GET /api/v1/missions/
//@route GET /api/v1/missions/?status=completed
//@route GET /api/v1/missions/?status=scheduled
//@route GET /api/v1/missions/?status=aborted
//@desc Admin views all scheduled missions (admin only), Fetch all missions (scheduled)
//@access Private
*/
router.get('/', auth_middleware_1.authMiddleware, (0, role_middleware_1.authorizedRoles)("admin"), mission_validator_1.validateGetPendingMissions, validate_request_1.validateRequest, mission_controller_1.getMissions);
/**
 * @swagger
 * /api/v1/missions/:id/complete:
 *   patch:
 *     summary: Mark a mission as completed
 *     tags: [Missions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Mission ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mission completed
 *       404:
 *         description: Mission not found
 *       401:
 *         description: Unauthorized
 */
/**
//@route PATCH /api/v1/missions/:id/complete
//@desc Admin completes mission (admin only), (status change to completed)
//@access Private
*/
router.patch('/:id/complete', auth_middleware_1.authMiddleware, (0, role_middleware_1.authorizedRoles)("admin"), mission_validator_1.validateMissionId, validate_request_1.validateRequest, mission_controller_1.completeMission);
/**
 * @swagger
 * /api/v1/missions/:id/abort:
 *   patch:
 *     summary: Abort a mission
 *     tags: [Missions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Mission ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mission aborted
 *       404:
 *         description: Mission not found
 *       401:
 *         description: Unauthorized
 */
/**
//@route PATCH /api/v1/missions/:id/abort
//@desc User aborts mission, (status change to aborted)
//@access Private
*/
router.patch('/:id/abort', auth_middleware_1.authMiddleware, (0, role_middleware_1.authorizedRoles)("admin", "user"), mission_validator_1.validateMissionId, validate_request_1.validateRequest, mission_controller_1.abortMission);
exports.default = router;
