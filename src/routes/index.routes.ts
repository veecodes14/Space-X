import express from "express";
import authRouter from "./auth.routes";
import userRouter from "./user.route";
import missionRouter from "./mission.route";


const rootRouter = express.Router();

//authentication routes
rootRouter.use('/auth',authRouter);

//user routes
rootRouter.use('/status',userRouter);

//mission routes
rootRouter.use('/rides',missionRouter);



export default rootRouter;