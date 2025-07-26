"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_routes_1 = __importDefault(require("./auth.routes"));
const user_routes_1 = __importDefault(require("./user.routes"));
const mission_routes_1 = __importDefault(require("./mission.routes"));
const rocket_routes_1 = __importDefault(require("./rocket.routes"));
const rootRouter = express_1.default.Router();
//authentication routes
rootRouter.use('/auth', auth_routes_1.default);
//user profile/status routes
rootRouter.use('/status', user_routes_1.default);
//mission-related routes
rootRouter.use('/missions', mission_routes_1.default);
//rocket-related routes
rootRouter.use('/rockets', rocket_routes_1.default);
exports.default = rootRouter;
