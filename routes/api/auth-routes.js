const express = require("express");

const contrl = require("../../controllers/auth-controllers");

const { validateBody } = require("../../utils");

const { schemas } = require("../../models/user");

const {authenticate, upload} = require("../../middlewares");




const router = express.Router();

router.post("/register", validateBody(schemas.registerSchema), contrl.register);

router.post("/verify",validateBody(schemas.emailSchema), contrl.resendVerifyEmail )

router.get("verify/:verificationToken", contrl.verify);

router.post("/login", validateBody(schemas.loginSchema), contrl.login);

router.get("/current", authenticate, contrl.getCurrent);

router.post("/logout", authenticate, contrl.logout);

router.patch("/avatars", authenticate, upload.single('avatar'), contrl.updateAvatar);

module.exports = router;