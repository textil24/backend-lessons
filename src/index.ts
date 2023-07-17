import "colors"
import "dotenv"
import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"
import { typeDefs } from "./schema/index.js"
import { resolvers } from "./resolvers/index.js"
import { PrismaClient } from "@prisma/client"

const API_PORT = 4000
const prisma = new PrismaClient()
const server = new ApolloServer({ typeDefs, resolvers })

async function main() {
    const { url } = await startStandaloneServer(server, {
        context: async () => ({
            prisma: () => prisma
        }),
        listen: { port: API_PORT }
    })
    
    console.log("Server started: ", url)
}

main()