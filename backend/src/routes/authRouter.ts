import { Router, type Router as ExpressRouter } from "express";
import { register, login, logout } from "../controller/auth.controller";

const router: ExpressRouter = Router();

router.post("/register", register); // register
router.post("/login", login);       // login
router.post("/logout", logout);     // logout

export { router as authRoutes };
