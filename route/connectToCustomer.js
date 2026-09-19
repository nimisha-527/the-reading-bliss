import express from "express";
import { wrapAsync } from "../utils/index.js";
import {submitRequest} from "../controllers/connectToCustomer.js";
const router = express.Router();

router.post('/connectToCustomer', wrapAsync(submitRequest));

export default router;