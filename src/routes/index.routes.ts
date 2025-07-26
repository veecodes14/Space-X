import express from "express";
import authRouter from "./auth.routes";
import userRouter from "./user.routes";
import missionRouter from "./mission.routes";
import rocketRouter from "./rocket.routes"



const rootRouter = express.Router();

//authentication routes
rootRouter.use('/auth',authRouter);

//user profile/status routes
rootRouter.use('/status',userRouter);

//mission-related routes
rootRouter.use('/missions',missionRouter);

//rocket-related routes
rootRouter.use('/rockets',rocketRouter);



export default rootRouter;