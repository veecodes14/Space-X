import { Request, Response } from 'express';
import { Mission } from '../models/mission.model';
import { Rocket } from '../models/rocket.model';
import { AuthRequest } from '../types/auth.request';
import { Schema, Types } from 'mongoose';
import { User} from '../models/user.model';


//@route POST /api/v1/rockets/add
//@desc Rider Request ride(rider only)
//@access Private

export const addRocket = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { name, rocketModel, fuelCapacity, active} = req.body;
        const userId = req.user?.id 

        if(!name || !rocketModel || !fuelCapacity || active === undefined) {
            res.status(400).json({
                success: false,
                message: "All fields are required"
            });
            return
        }

        const admin = await User.findById(userId).select('-password -__v');

        if (admin?.role !== 'admin') {
            res.status(403).json({
                success: false,
                message: "Only admins can add rockets"
            });
            return;
            }
        
        const existingRocket = await Rocket.findOne({ name });
        
        if (existingRocket) {
            res.status(409).json({
                success: false,
                message: "A rocket with this name already exists"
            });
            return;
        }

        const rocket = await Rocket.create({
            name: name,
            rocketModel: rocketModel,
            fuelCapacity: fuelCapacity,
            active: active,
            admin: admin?._id,
            
        })

        res.status(201).json({
            success: true,
            message: "Rocket added successfully.",
            data: rocket
        })
    } catch (error) {
        console.log({message: "Error adding rocket", error});
        res.status(500).json({ success: false, error: "Internal Server Error"})
        return
    }
}

export const updateRocket = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params
        // const updates = req.body

        const allowedFields = ['name', 'rocketModel', 'fuelCapacity', 'active'];
        const updates = Object.fromEntries(
            Object.entries(req.body).filter(([key]) => allowedFields.includes(key))
        );


        const userId = (req as AuthRequest).user?.id;
        const user = await User.findById(userId);
        if (user?.role !== 'admin') {
            res.status(403).json({
                success: false,
                message: "Only admins can update rockets"
            });
            return
            }


        const updatedRocket = await Rocket.findByIdAndUpdate(
            id,
            updates,
            {new: true, runValidators: true}
        );

        if (!updatedRocket) {
            res.status(404).json({
                success: false,
                message: 'Rocket not found',
            })
            return
        }

        res.status(200).json({
            success: true,
            message: "Rocket updated successfully",
            data: updatedRocket
        })
    
    } catch (error) {
        console.error('Update Rocket Error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

export const getRockets = async(req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;

        if(!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized: No user found. Please login"
            })
            return;

        }

        const user = await User.findById(userId).select('-password -__v');

         if (!user || user.role !== 'admin') {
            res.status(403).json({
                success: false,
                message: "Access denied. Admins only."
            });
            return
        } 

        const rockets = await Rocket.find({ isDeleted: false }).select('-createdAt -updatedAt -__v')

        res.status(200).json({
            success: true,
            message: "RockeTs fetched successfully.",
            data: rockets
        })
    } catch (error) {
       console.log({ message: "Error fetching rockets", error});
        res.status(500).json({ success: false, error: "Internal Server Error" });
        return; 
    }
}


export const deleteRocket = async(req: AuthRequest, res: Response): Promise<void> => {
    try {
    const { id } = req.params;
    const userId = req.user?.id;

    const user = await User.findById(userId);
    if (user?.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: "Only admins can delete rockets",
      });
      return;
    }

    const deletedRocket = await Rocket.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (!deletedRocket) {
      res.status(404).json({
        success: false,
        message: 'Rocket not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Rocket deleted successfully',
    });

  } catch (err) {
    console.error('Delete Rocket Error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

