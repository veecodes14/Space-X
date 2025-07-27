import { Request, Response } from 'express';
import { Mission } from '../models/mission.model';
import { AuthRequest } from '../types/auth.request';
import { Schema, Types, isValidObjectId } from 'mongoose';
import { User} from '../models/user.model';
import { Rocket } from '../models/rocket.model';


//@route POST /api/v1/mission/schedule
//@desc Mission Schedule (user)
//@access Private
export const scheduleMission = async(req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { name, rocket, launchDate, launchLocation, destination } = req.body;
        const userId = req.user?.id

        if (!userId) {
        res.status(401).json({
            success: false,
            message: "Unauthorized: No user found. Please login"
        });
        return;
        }

        if (!name || !rocket || !launchDate || !launchLocation || !destination) {
            res.status(400).json({
                success: false,
                message: "All fields are required"
            });
            return
        }

        if (!isValidObjectId(rocket)) {
            res.status(400).json({
                success: false,
                message: "Invalid rocket ID"
            });
            return;
        }

        const existingRocket = await Rocket.findById(rocket)

        if (existingRocket) {
            res.status(404).json({
                success: false,
                message: "Rocket does not exist"
            })
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
                name: name,
                rocket: rocket,
                launchDate: launchDate,
                launchLocation: launchLocation,
                destination: destination,
                scheduledBy: req.user?.id,
                status: 'scheduled'

            }
        )

        // if(!mission || mission.status !== 'pending') {
        //     res.status(404).json({
        //         success: false,
        //         message: "Mission not available at this time"
        //     });
        //     return

        // }

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

export const getMissions = async(req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id

        if(!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized: No user found. Please login"
            })
            return
        }

        const admin = await User.findById(userId).select('-password -__v');
        console.log(admin)

        if (!admin || admin.role !== 'admin') {
            res.status(403).json({
                success: false,
                message: "Access denied. Admins only."
            });
            return;
        }

        const { status } = req.query;

        const filter = status ? { status: status.toString() } : {};

        const missions = await Mission.find(filter).select('-createdAt -__v');

        res.status(200).json({
            success: true,
            message: "Missions fetched successfully.",
            data: missions
        })
        return;

    }   catch (error) {
        console.log({ message: "Error fetching missions", error});
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
                message: "Mission not in progress at this time",
            });
            return;
        }
        
        if (mission.scheduledBy.toString() !== userId) {
        res.status(403).json({
            success: false,
            message: "You are not authorized to complete this mission."
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

        if (!mission) {
            res.status(404).json({
            success: false,
            message: "Mission not found",
        });
        return;
        }

        if (mission.scheduledBy.toString() !== userId) {
            res.status(403).json({
            success: false,
            message: "You are not authorized to abort this mission",
        });
        return;
        }

        if (mission.status !== "scheduled") {
            res.status(400).json({
            success: false,
            message: "Only scheduled missions can be aborted",
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


