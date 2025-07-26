"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.abortMission = exports.completeMission = exports.getMissions = exports.scheduleMission = void 0;
const mission_model_1 = require("../models/mission.model");
const user_model_1 = require("../models/user.model");
//@route POST /api/v1/mission/schedule
//@desc Mission Schedule (user)
//@access Private
const scheduleMission = async (req, res) => {
    try {
        const { name, rocket, launchDate, launchLocation, destination } = req.body;
        const userId = req.user?.id;
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
            return;
        }
        const user = await user_model_1.User.findById(userId).select('-password -__v');
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found"
            });
            return;
        }
        const mission = await mission_model_1.Mission.create({
            name: name,
            rocket: rocket,
            launchDate: launchDate,
            launchLocation: launchLocation,
            destination: destination,
            scheduledBy: req.user?.id,
            status: 'scheduled'
        });
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
        });
    }
    catch (error) {
        console.log({ message: "Error scheduling mission", error });
        res.status(500).json({ success: false, error: "Internal Server Error" });
        return;
    }
};
exports.scheduleMission = scheduleMission;
//@route GET /api/v1/missions/pending
//@desc Admin views all pending rides (admin only), Fetch all new rides (pending)
//@access Private
const getMissions = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized: No user found. Please login"
            });
            return;
        }
        const admin = await user_model_1.User.findById(userId).select('-password -__v');
        console.log(admin);
        if (!admin || admin.role !== 'admin') {
            res.status(403).json({
                success: false,
                message: "Access denied. Admins only."
            });
            return;
        }
        const { status } = req.query;
        const filter = status ? { status: status.toString() } : {};
        const missions = await mission_model_1.Mission.find(filter).select('-createdAt -__v');
        res.status(200).json({
            success: true,
            message: "Missions fetched successfully.",
            data: missions
        });
    }
    catch (error) {
        console.log({ message: "Error fetching missions", error });
        res.status(500).json({ success: false, error: "Internal Server error" });
        return;
    }
};
exports.getMissions = getMissions;
const completeMission = async (req, res) => {
    try {
        const missionId = req.params.id;
        const userId = req.user?.id;
        if (!missionId || !userId) {
            res.status(400).json({
                success: false,
                message: "Mission ID and user ID are required"
            });
            return;
        }
        const mission = await mission_model_1.Mission.findById(missionId);
        if (!mission || mission.status !== 'scheduled') {
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
        });
    }
    catch (error) {
        console.log({ message: "Error finishing mission", error });
        res.status(500).json({ success: false, error: "Internal Server Error" });
        return;
    }
};
exports.completeMission = completeMission;
const abortMission = async (req, res) => {
    try {
        const missionId = req.params.id;
        const userId = req.user?.id;
        if (!missionId || !userId) {
            res.status(400).json({
                success: false,
                message: "Mission ID and user ID are required"
            });
            return;
        }
        const mission = await mission_model_1.Mission.findById(missionId);
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
        });
    }
    catch (error) {
        console.log({ message: "Error aborting mission", error });
        res.status(500).json({ success: false, error: "Internal Server Error" });
        return;
    }
};
exports.abortMission = abortMission;
