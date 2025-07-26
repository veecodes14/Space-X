import express from 'express';
const router = express.Router();
import {scheduleMission, completeMission, abortMission, getMissions} from "../controllers/mission.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorizedRoles } from "../middlewares/role.middleware";
import { validateScheduleMission, validateMissionId, validateGetPendingMissions } from '../validators/mission.validator';
import { validateRequest } from '../middlewares/validate.request';


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
router.post('/schedule', authMiddleware, authorizedRoles("admin", "user"), validateScheduleMission, validateRequest, scheduleMission);



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
router.get('/', authMiddleware, authorizedRoles("admin"), validateGetPendingMissions, validateRequest, getMissions);


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
router.patch('/:id/complete', authMiddleware, authorizedRoles("admin"), validateMissionId, validateRequest, completeMission);


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
router.patch('/:id/abort', authMiddleware, authorizedRoles("admin","user"), validateMissionId, validateRequest, abortMission);


export default router;