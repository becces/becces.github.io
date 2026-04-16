import { Router, type IRouter } from "express";
import healthRouter from "./health";
import tracksRouter from "./tracks";
import albumsRouter from "./albums";
import artistRouter from "./artist";
import statsRouter from "./stats";
import featuredRouter from "./featured";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/tracks", tracksRouter);
router.use("/albums", albumsRouter);
router.use("/artist", artistRouter);
router.use("/stats", statsRouter);
router.use("/featured", featuredRouter);

export default router;
