import fastify from "fastify";
import { TelegramRoutes } from "./routes/Telegram.route"; 

export const app = fastify()

app.register(TelegramRoutes, {prefix: "/api"})

app.listen({port: 3000}, (err, address) => {
    if(err){
        console.log(err)
    }
    console.log("server rodando")
})