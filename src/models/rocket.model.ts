import mongoose, { Schema, Document, model } from "mongoose";

export interface IRocket extends Document {
    name: string;
    rocketModel: string;
    fuelCapacity: number;
    active: boolean;
    createdBy: Schema.Types.ObjectId;
    isDeleted: boolean
    deletedAt: Date
    // createdAt: Date;
}

const RocketSchema: Schema = new Schema<IRocket> ({
    name: {type: String, required: true},
    rocketModel: {type: String, enum: ['Falcon9', 'Starship', 'AtlasV'], required: true},
    fuelCapacity: {type: Number, required: true, min: 1 },
    active: {type: Boolean, required: true},
    createdBy: {type: Schema.Types.ObjectId, ref: 'User'},
    isDeleted: {type: Boolean, required: true, default: false},
    deletedAt: { type: Date, default: null}
},
{
    timestamps: true,
}
)


export const Rocket = mongoose.model<IRocket>('Rocket', RocketSchema);