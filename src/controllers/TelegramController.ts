import { FastifyRequest, FastifyReply } from "fastify"

export class TelegramController {
    webhook = async (req: FastifyRequest, res: FastifyReply) => {
        try {
            console.log(req.body)
            res.status(200).send({
                message: "deu boa"
            })
        } catch (error) {
            res.status(500).send({
                error: (error as Error).message
            })
        }
    }
}