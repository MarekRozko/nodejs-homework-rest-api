const express = require("express");

const contrl = require("../../controllers/auth-controllers");

const { validateBody } = require("../../utils");

const { schemas } = require("../../models/user");

const {authenticate} = require("../../middlewares")

const router = express.Router();

router.post("/register", validateBody(schemas.registerSchema), contrl.register);

router.post("/login", validateBody(schemas.loginSchema), contrl.login);

router.get("/current", authenticate, contrl.getCurrent);

router.post("/logout", authenticate, contrl.logout )

module.exports = router;