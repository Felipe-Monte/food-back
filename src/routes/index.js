const { Router } = require("express");

const usersRouter = require("./users.routes");
const dishesRouter = require("./dishes.routes");
const tagsRouter = require("./tags.routes")
const sessionsRouter = require("./sessions.routes")

const routes = Router();

routes.use("/users", usersRouter);
routes.use("/sessions", sessionsRouter)
routes.use("/dishes", dishesRouter);
routes.use("/tags", tagsRouter)

module.exports = routes;