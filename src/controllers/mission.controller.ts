import { Request, Response } from 'express';
import { Mission } from '../models/mission.model';
import { AuthRequest } from '../types/auth.request';
import { Schema, Types } from 'mongoose';
import { User} from '../models/user.model';

//@route POST /api/v1/mission/schedule
//@desc Mission Schedule (user)
//@access Private


export const scheduleMission = async(req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { rocket, launchDate, launchLocation, destination } = req.body;
        const userId = req.user?.id

        if (!rocket || !launchDate || !launchLocation || !destination) {
            res.status(400).json({
                success: false,
                message: "All fields are required"
            });
            return
        }

        const user = await User.findById(userId).select('-password -__v');
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found"
            });
            return
        }

        const mission = await Mission.create(
            {
                rocket: rocket,
                launchDate: launchDate,
                launchLocation: launchLocation,
                destination: destination,
                user: user?._id,

            }
        )

        if(!mission || mission.status !== 'pending') {
            res.status(404).json({
                success: false,
                message: "Mission not available at this time"
            });
            return

        }

        res.status(200).json({
            success: true,
            message: "Mission successfully scheduled",
            data: mission
        })

    } catch (error) {
        console.log({message: "Error scheduling mission", error});
        res.status(500).json({success: false, error: "Internal Server Error"})
        return
    }
}

//@route GET /api/v1/missions/pending
//@desc Admin views all pending rides (admin only), Fetch all new rides (pending)
//@access Private

export const getPendingMissions = async(req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id

        if(!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized: No user found. Please login"
            })
        }

        const admin = await User.findById(userId).select('-password -__v');
        console.log(admin)

        const missions = await Mission.find({
            status: "pending"
        }).select('-createdAt -__v')

        res.status(200).json({
            success: true,
            message: "Rides fetched successfully.",
            data: missions
        })
    }   catch (error) {
        console.log({ message: "Error fetching rides", error});
        res.status(500).json({success: false, error: "Internal Server error"});
        return
    }
}


export const completeMission = async(req: AuthRequest, res: Response): Promise<void> => {
    try {
        const missionId = req.params.id;
        const userId = req.user?.id;
        if(!missionId || !userId) {
            res.status(400).json({
                success: false,
                message: "Mission ID and user ID are required"
            });
            return;
        }
        
        const mission = await Mission.findById(missionId);
        if(!mission || mission.status !== 'scheduled') {
            res.status(404).json({
                success: false,
                message: "Mission not in progress at this time. Please start the ride first.",
            });
            return;
        }
        mission.status = "completed";
        await mission.save();

        res.status(200).json({
            success: true,
            message: "Mission completed successfully",
            data: mission
        })
    } catch (error) {
        console.log({ message: "Error finishing mission", error});
        res.status(500).json({ success: false, error: "Internal Server Error"});
        return;
    }
}

export const abortMission = async(req: AuthRequest, res: Response): Promise<void> => {
    try {
        const missionId = req.params.id;
        const userId = req.user?.id;
        if(!missionId || !userId) {
            res.status(400).json({
                success: false,
                message: "Mission ID and user ID are required"
            });
            return;
        }
        
        const mission = await Mission.findById(missionId);
        if(!mission || mission.status !== 'scheduled') {
            res.status(404).json({
                success: false,
                message: "Mission not in progress at this time",
            });
            return;
        }
        mission.status = "aborted";
        await mission.save();

        res.status(200).json({
            success: true,
            message: "Mission aborted successfully",
            data: mission
        })
    } catch (error) {
        console.log({ message: "Error aborting mission", error});
        res.status(500).json({ success: false, error: "Internal Server Error"});
        return;
    }
}


