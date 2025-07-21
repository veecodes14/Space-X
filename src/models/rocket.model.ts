import mongoose, { Schema, Document, model } from "mongoose";

export interface IRocket extends Document {
    name: string;
    rocketModel: string;
    fuelCapacity: number;
    active: boolean;
    createdBy: Schema.Types.ObjectId;
    createdAt: Date;
}

const RocketSchema: Schema = new Schema<IRocket> ({
    name: {type: String, required: true},
    rocketModel: {type: String, required: true},
    fuelCapacity: {type: Number, required: true},
    active: {type: Boolean, required: true},
    createdBy: {type: Schema.ObjectId, ref: 'User'},
})


export const Rocket = mongoose.model<IRocket>('Rocket', RocketSchema);