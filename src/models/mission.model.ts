import mongoose, { Schema, Document,  model } from  "mongoose";
import { RideStatus } from "../types/ride.types";
import { SpaceXLocation } from "../types/spacex.location";



export interface IMission extends Document {
    name: string;
    rocket: Schema.Types.ObjectId;
    launchDate: Date;
    launchLocation: SpaceXLocation;
    destination: string;
    status: RideStatus;
    scheduledBy: Schema.Types.ObjectId;
    createdAt: Date;
}

const MissionSchema: Schema = new Schema<IMission> ({
    name: {type: String, required: true},
    rocket: {type: Schema.ObjectId, ref: 'Rocket'},
    launchDate: {type: Date, required: true},
    launchLocation: {type: String, enum: ['base1405'], default: 'base1405'},
    destination: {type: String, required: true},
    status: {type: String, enum: ['pending', 'scheduled', 'aborted', 'completed'], default: 'scheduled'},
    scheduledBy: {type: Schema.ObjectId, ref: 'User'},
    createdAt: {type: Date, default: Date.now}
},
{
    timestamps: true,
}
)

export const Mission = mongoose.model<IMission>('Mission', MissionSchema);

