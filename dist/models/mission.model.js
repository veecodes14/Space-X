"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mission = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const MissionSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    rocket: { type: mongoose_1.Schema.ObjectId, ref: 'Rocket' },
    launchDate: { type: Date, required: true },
    launchLocation: { type: String, enum: ['base1405'], default: 'base1405' },
    destination: { type: String, required: true },
    status: { type: String, enum: ['scheduled', 'aborted', 'completed'], default: 'scheduled' },
    scheduledBy: { type: mongoose_1.Schema.ObjectId, ref: 'User' },
    // createdAt: {type: Date, default: Date.now}
}, {
    timestamps: true,
});
exports.Mission = mongoose_1.default.model('Mission', MissionSchema);
