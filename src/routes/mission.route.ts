import express from 'express';
const router = express.Router();
import {scheduleMission, completeMission, abortMission, getPendingMissions} from "../controllers/mission.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorizedRoles } from "../middlewares/role.middleware";
import { validateScheduleMission } from '../middlewares/mission.middleware';
import { validateRequest } from '../middlewares/validate.request';

/**
 * @route POST /api/v1/missions/schedule
 * @desc User Schedule mission(admin and user)
 * @access Private
 */
router.post('/schedule', authMiddleware, authorizedRoles("user"), validateScheduleMission, validateRequest, scheduleMission);

/**
//@route GET /api/v1/missions/pending
//@route GET /api/v1/missions/pending/?status=completed
//@route GET /api/v1/missions/pending/?status=scheduled
//@route GET /api/v1/missions/pending/?status=aborted
//@desc Admin views all scheduled missions (admin only), Fetch all missioms (scheduled)
//@access Private
*/
router.get('/pending', authMiddleware, authorizedRoles("admin"), getPendingMissions);

/** 
//@route PATCH /api/v1/missions/:id/complete
//@desc Admin completes mission (admin only), (status change to completed)
//@access Private
*/
router.patch('/:id/complete', authMiddleware, authorizedRoles("user"), completeMission);

/**
//@route PATCH /api/v1/rides/:id/abort
//@desc User aborts mission, (status change to aborted)
//@access Private
*/
router.patch('/:id/abort', authMiddleware, authorizedRoles("user"), abortMission);


export default router;