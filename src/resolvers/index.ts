export const resolvers = {
    Query: {
        getLessons: async (parent, args, { prisma }) => {
            return await prisma().lessons.findMany()
        },
        getLesson: async (parent, { id }, { prisma }) => {
            return await prisma().lessons.findUnique({
                where: { id }
            })
        }
    },
    Mutation: {
        createLesson: async (parent, { input }, { prisma }) => {
            return await prisma().lessons.create({
                data: {
                    name: input.name,
                    content: input.content,
                    nextLessonId: input.nextLessonId,
                    prevLessonId: input.prevLessonId,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            })
        },
        updateLesson: async (parent, { id, input }, { prisma }) => {
            return await prisma().lessons.update({
                where: { id },
                data: {
                    name: input.name,
                    content: input.content,
                    nextLessonId: input.nextLessonId,
                    prevLessonId: input.prevLessonId,
                    updatedAt: new Date().toISOString()
                }
            })
        },
        deleteLesson: async (parent, { id }, { prisma }) => {
            return await prisma().lessons.delete({
                where: { id }
            })
        }
    }
}