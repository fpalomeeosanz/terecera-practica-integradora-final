import { Router } from "express";;
import { checkRole } from "../middlewares/auth.js";
import { UserController } from "../controllers/users.controllres.js";

const router = Router();

router.put("/premium/:uid", checkRole(["admin"]) , UserController.changeRol);

export { router as usersRouter };