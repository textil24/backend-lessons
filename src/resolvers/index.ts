export const resolvers = {
    Query: {
        getProgress: async (parent, { tgUserId, contentId, lessonId }, { prisma }) => {
            return await prisma().progress.findFirst({
                where: { tgUserId, contentId, lessonId }
            })
        },
        getCourses: async (parent, args, { prisma }) => {
            const courses = await prisma().course.findMany({
                include: {
                    lessons: true,
                }
            });

            async function getCountProgress(lessonId: string): Promise<number> {
                return await prisma().progress.count({
                    where: {
                        lessonId,
                        tgUserId: 666
                    }
                })
            }

            const newCourses = await Promise.all(courses.map(async course => {
                const contentTotalIsEstimatedCount = course.lessons.reduce((acc, item) => acc + item.contentIsEstimatedCount, 0);
                const contentTotalDoneCount = await course.lessons.reduce(async (accPromise, lesson) => {
                    const acc = await accPromise;
                    const doneCount = await getCountProgress(lesson.id);
                    return acc + doneCount;
                }, Promise.resolve(0));

                const progressCourse = Math.floor((contentTotalDoneCount/contentTotalIsEstimatedCount) * 100)

                return {
                    ...course,
                    contentTotalIsEstimatedCount,
                    contentTotalDoneCount,
                    progressCourse
                };
            }));

            console.log(newCourses)

            return newCourses;
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

            function getCountIsEstimatedTrue(lessonElements: { content: any[] }): number {
                return lessonElements.content.reduce((accumulator, currentValue) => {
                    if (currentValue.isEstimated === true) {
                        return accumulator + 1;
                    }
                    return accumulator;
                }, 0)
            }

            async function getCountProgress(lessonId: string) {
                return await prisma().progress.count({
                    where: {
                        lessonId,
                        tgUserId: 666
                    }
                })
            }


            async function getAllProgress(lessonId: string) {
                return await prisma().progress.findMany({
                    where: {
                        lessonId,
                        tgUserId: 666
                    }
                })
            }

            return {
                ...lessonElements,
                course: {
                    ...lessonElements.course,
                    lessons: lessonElements.course.lessons.map(async (item) => ({
                        ...item,
                        content: item.content.sort((a, b) => a.orderBy - b.orderBy),
                        contentTotal: item.content.length,
                        contentTotalIsEstimated: getCountIsEstimatedTrue(item),
                        userProgress: {
                            contentTotalDone: await getCountProgress(item.id),
                            contentTotalDonePercent: Math.floor((await getCountProgress(item.id) / getCountIsEstimatedTrue(item)) * 100),
                            results: getAllProgress(item.id)
                        }
                    })
                    )

                },
                content: lessonElements.content.sort((a, b) => a.orderBy - b.orderBy),
                contentTotal: lessonElements.content.length,
                contentTotalIsEstimated: getCountIsEstimatedTrue(lessonElements),
                userProgress: {
                    contentTotalDone: await getCountProgress(lessonElements.id),
                    contentTotalDonePercent: Math.floor((await getCountProgress(lessonElements.id) / getCountIsEstimatedTrue(lessonElements)) * 100),
                    results: getAllProgress(lessonElements.id)
                }
            }
        }
    },
    Mutation: {
        createProgress: async (parent, { input }, { prisma }) => {
            return await prisma().progress.upsert({
                where: {
                    tgUserId_contentId_lessonId: {
                        tgUserId: input.tgUserId,
                        contentId: input.contentId,
                        lessonId: input.lessonId
                    }
                },
                update: {
                    isCorrect: input.isCorrect,
                },
                create: {
                    tgUserId: input.tgUserId,
                    contentId: input.contentId,
                    isCorrect: input.isCorrect,
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
                                contentIsEstimatedCount: item.content.filter(el => el.isEstimated).length,
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