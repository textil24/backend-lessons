export const resolvers = {
    Query: {
        getCourses: async (parent, args, { prisma }) => {
            let courses = []
            const course = await prisma().course.findMany()

            await Promise.all(course.map(async (item) => {
                const currentLesson = await prisma().lesson.findMany({
                    where: { courseId: item.id }
                })
                courses.push({
                    ...item,
                    lessons: currentLesson
                })
            }
            ))

            return courses
        },
        getCourse: async (parent, { id }, { prisma }) => {
            const course = await prisma().course.findUnique({
                where: { id }
            })

            const lessons = await prisma().lesson.findMany({
                where: { courseId: course.id }
            })

            return {
                ...course,
                lessons
            }
        },
        getLessons: async (parent, args, { prisma }) => {
            return await prisma().lesson.findMany()
        },
        getLesson: async (parent, { id }, { prisma }) => {
            const lessonElements = await prisma().lessons.findUnique({
                where: { id }
            })

            return {
                ...lessonElements,
                content: lessonElements.content.sort((a, b) => a.order - b.order)
            }
        }
    },
    Mutation: {
        createCourse: async (parent, { input }, { prisma }) => {

            const currentDate = String(Date.now())
            const course = await prisma().course.create({
                data: {
                    name: input.name,
                    category: input.category,
                    description: input.description,
                    preview: input.preview,
                    createdAt: currentDate,
                    updatedAt: currentDate
                }
            })

            const lessons = await Promise.all(input.lessons.map(async (item) =>
                await prisma().lesson.create({
                    data: {
                        name: item.name,
                        content: item.content,
                        orderBy: item.orderBy,
                        nextLessonId: null,
                        prevLessonId: null,
                        createdAt: currentDate,
                        updatedAt: currentDate,
                        courseId: course.id
                    }
                })
            ))

            return {
                ...course,
                lessons
            }

        },
        createLesson: async (parent, { input }, { prisma }) => {
            const currentDate = String(Date.now())
            return await prisma().lessons.create({
                data: {
                    name: input.name,
                    content: input.content,
                    nextLessonId: input.nextLessonId,
                    prevLessonId: input.prevLessonId,
                    createdAt: currentDate,
                    updatedAt: currentDate
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
                    updatedAt: Date.now()
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