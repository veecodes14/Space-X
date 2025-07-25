import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt'



export interface IPasswordReset extends Document {

    userId: string;
    email: string;
    otp: string;
    expiresAt: Date;
    compareOtp(candidateOtp: string): Promise<boolean>;
}

const PasswordResetSchema: Schema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    email: { type: String, required: true, match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'] },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
}, {
    timestamps: true,
});

PasswordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

PasswordResetSchema.pre<IPasswordReset>('save', async function (next) {
  if (!this.isModified('otp')) return next();
  const salt = await bcrypt.genSalt(10);
  this.otp = await bcrypt.hash(this.otp, salt);
  next();
});

PasswordResetSchema.methods.compareOtp = function (candidateOtp: string): Promise<boolean> {
  return bcrypt.compare(candidateOtp, this.otp);
};


export default mongoose.model<IPasswordReset>('PasswordReset', PasswordResetSchema);