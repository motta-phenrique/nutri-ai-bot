import { FastifyInstance } from "fastify"
import { TelegramController } from "../controllers/TelegramController"

const controller = new TelegramController()

export async function TelegramRoutes(app: FastifyInstance) {
    app.post("/webhook", controller.webhook)
}