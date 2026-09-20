
import express from "express";
import { wrapAsync, isLoggedIn, isOwner } from "../utils/index.js";
import {recommend} from "../controllers/recommend.js";
const router = express.Router({mergeParams: true});

router.post('/:id/recommend/:userId',isLoggedIn,isOwner, wrapAsync(recommend))

export default router;