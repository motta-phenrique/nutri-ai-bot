import { FastifyInstance } from "fastify"
import { TelegramController } from "../controllers/TelegramController"

const controller = new TelegramController()

export async function TelegramRoutes(app: FastifyInstance) {
    app.get("/webhook", controller.webhook)
}