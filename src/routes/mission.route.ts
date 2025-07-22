import express from 'express';
const router = express.Router();
import {scheduleMission, completeMission, abortMission, getPendingMissions} from "../controllers/mission.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorizedRoles } from "../middlewares/role.middleware";

/**
 * @route POST /api/v1/missions/request
 * @desc User Request ride(rider only)
 * @access Private
 */
router.post('/request', authMiddleware, authorizedRoles("user"), scheduleMission);

//@route GET /api/v1/rides/pending
//@desc Driver views all pending rides (driver only), Fetch all new rides (pending)
//@access Private
router.get('/pending', authMiddleware, authorizedRoles("user"), getPendingMissions);

//@route PATCH /api/v1/rides/:id/complete
//@desc Driver completes ride (driver only), (status change to completed)
//@access Private
router.patch('/:id/complete', authMiddleware, authorizedRoles("user"), completeMission);

//@route PATCH /api/v1/rides/:id/complete
//@desc Driver completes ride (driver only), (status change to completed)
//@access Private
router.patch('/:id/abort', authMiddleware, authorizedRoles("user"), abortMission);


export default router;