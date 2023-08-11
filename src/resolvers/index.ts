export const resolvers = {
    Query: {
        getProgress: async (parent, { tgUserId, contentId, lessonId }, { prisma }) => {
            console.log(tgUserId, lessonId)
            const progress = await prisma().progress.findFirst({
                where: { tgUserId, contentId, lessonId }
            })

            return progress
        },
        getCourses: async (parent, args, { prisma }) => {
            const courses = await prisma().course.findMany({
                include: {
                    lessons: true,
                }
            });

            return courses;
        },
        getCourse: async (parent, { id }, { prisma }) => {
            const course = await prisma().course.findUnique({
                where: { id },
                include: {
                    lessons: {
                        orderBy: {
                            orderBy: "asc"
                        }
                    },
                },
            });

            return course
        },
        getLessons: async (parent, args, { prisma }) => {
            return await prisma().lesson.findMany()
        },
        getLesson: async (parent, { id }, { prisma }) => {
            const lessonElements = await prisma().lesson.findUnique({
                where: { id },
                include: {
                    course: {
                        include: {
                            lessons: {
                                orderBy: {
                                    orderBy: "asc"
                                }
                            }
                        }
                    },
                }
            })

            return {
                ...lessonElements,
                content: lessonElements.content.sort((a, b) => a.orderBy - b.orderBy)
            }
        }
    },
    Mutation: {
        createProgress: async (parent, { input }, { prisma }) => {

            console.log(input)

            return await prisma().progress.create({
                data: {
                    tgUserId: input.tgUserId,
                    contentId: input.contentId,
                    isEstimated: input.isEstimated,
                    lessonId: input.lessonId
                }
            })
        },
        createCourse: async (parent, { input }, { prisma }) => {

            const currentDate = String(Date.now())
            const course = await prisma().course.create({
                data: {
                    name: input.name,
                    category: input.category,
                    description: input.description,
                    preview: input.preview,
                    createdAt: currentDate,
                    updatedAt: currentDate,
                    lessons: {
                        createMany: {
                            data: input.lessons.map((item) => ({
                                name: item.name,
                                content: item.content,
                                orderBy: item.orderBy,
                                nextLessonId: null,
                                prevLessonId: null,
                                createdAt: currentDate,
                                updatedAt: currentDate,
                            })),
                        },
                    },
                },
                include: {
                    lessons: true,
                },
            });

            const currentLessons = course.lessons;

            for (let i = 0; i < currentLessons.length; i++) {
                if (i === 0) {
                    // первый элемент списка
                    currentLessons[i].nextLessonId = currentLessons[i + 1].id;
                } else if (i === currentLessons.length - 1) {
                    // последний элемент списка
                    currentLessons[i].prevLessonId = currentLessons[i - 1].id;
                } else {
                    // все остальные элементы списка
                    currentLessons[i].prevLessonId = currentLessons[i - 1].id;
                    currentLessons[i].nextLessonId = currentLessons[i + 1].id;
                }
            }

            const updatedCourse = await prisma().course.update({
                where: { id: course.id },
                data: {
                    createdAt: currentDate,
                    updatedAt: currentDate,
                    lessons: {
                        updateMany: currentLessons.map(({ id, prevLessonId, nextLessonId }) => ({
                            where: { id },
                            data: { prevLessonId, nextLessonId, createdAt: currentDate, updatedAt: currentDate },
                        })),
                    },
                },
                include: {
                    lessons: true,
                },
            });

            return updatedCourse;
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