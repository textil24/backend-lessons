export const resolvers = {
    Query: {
        lessons: async (parent, args, { prisma }) => {
            return await prisma().lesson.findMany()
        }
    },
    Mutation: {
        createLesson: async (parent, { input }, { prisma }) => {
            console.log(input)
            return await prisma().lesson.create({
                data: {
                    name: input.name,
                    content: input.content,
                    nextLessonId: input.nextLessonId,
                    prevLessonId: input.prevLessonId,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            })
        }
    }
}