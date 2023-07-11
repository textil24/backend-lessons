import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const resolvers = {
    Query: {
        cards: () => {
            return prisma.card.findMany()
        }
    },
    Mutation: {
        createCard: async (parent, args, context, info) => {
            const createdCard = await prisma.card.create({
                data: {
                    title: args.input.title,
                    text: args.input.text,
                },
            });

            return createdCard;
        }
    }
}