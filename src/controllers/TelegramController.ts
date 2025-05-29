import { FastifyRequest, FastifyReply } from "fastify"
import { TelegramService } from "../services/TelegramService"

const service = new TelegramService()

export class TelegramController {
    webhook = async (req: FastifyRequest, res: FastifyReply) => {
        const request = req.body

        console.log(request)
        try {
            res.status(200).send({
                message: "OK"
            })
        } catch (error) {
            res.status(500).send({
                error: (error as Error).message
            })
        }
    }
}