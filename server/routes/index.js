import express from 'express';
import userRoutes from './user.route';
import authRoutes from "./auth.route";
import {authorize} from "../beans/auth";

const router = express.Router();

router.use('/auth',authRoutes)
router.use(authorize)
router.use('/user',userRoutes);


module.exports = router;


