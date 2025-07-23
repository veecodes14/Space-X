import express from "express";
import authRouter from "./auth.routes";
import userRouter from "./user.route";
import missionRouter from "./mission.route";
import rocketRouter from "./rocket.routes"



const rootRouter = express.Router();

//authentication routes
rootRouter.use('/auth',authRouter);

//user routes
rootRouter.use('/status',userRouter);

//mission routes
rootRouter.use('/missions',missionRouter);

//rocket routes
rootRouter.use('/rockets',rocketRouter);



export default rootRouter;