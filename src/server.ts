import fastify from "fastify";
import { TelegramRoutes } from "./routes/Telegram.route"; 
import dotenv from "dotenv";


dotenv.config();

export const app = fastify()

app.register(TelegramRoutes, {prefix: "/api"})

app.listen({port: 3000}, (err, address) => {
    if(err){
        console.log(err)
    }
    console.log("server rodando")
})