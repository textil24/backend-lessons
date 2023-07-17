export const resolvers = {
    Query: {
        cards: async (parent, args, {prisma}) => {
            return await prisma().card.findMany()
        },
        card: async (parent, {id}, {prisma}) => {
            return await prisma().card.findUnique({
                where: { id }
            })
        }
    },
    Mutation: {
        createCard: async (parent, {input}, {prisma}) => {
            return await prisma().card.create({
                data: {
                    title: input.title,
                    text: input.text,
                }
            })
        },
        updateCard: async (parent, {id, input}, {prisma}) => {
            return await prisma().card.update({
                where: { id },
                data: {
                    title: input.title,
                    text: input.text
                }
            })
        },
        deleteCard: async (parent, {id}, {prisma}) => {
            return await prisma().card.delete({
                where: { id }
            })
        }
    }
}