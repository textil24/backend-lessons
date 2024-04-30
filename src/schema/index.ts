export const typeDefs = `#graphql
    scalar UUID
    scalar Timestamp
    scalar JSON

    type Query {
        getProgress(tgUserId: Int!, contentId: Int!, lessonId: String!): Progress
        getCourses: [Course!]!
        getCourse(id: UUID!): Course!
        getLessons: [Lesson!]!
        getLesson(id: UUID!): Lesson!
    }

    type Mutation {
        createProgress(input: ProgressInput!): Progress!
        createCourse(input: CourseInput!): Course!
        createLesson(input: LessonInput!): Lesson!
        updateLesson(id: UUID!, input: LessonInput!): Lesson!
        deleteLesson(id: UUID!): Lesson!
    }

    input ProgressInput {
        tgUserId:    Int!
        contentId:   Int!
        lessonId:    String!
        isCorrect:   Boolean!
    }

    type Progress {
        tgUserId:    Int!
        contentId:   Int!
        lessonId:    String!
        isCorrect: Boolean!
    }

    input CourseInput {
        name: String!
        category: String!
        description: String!
        preview: String!
        lessons: [LessonInput!]!
    }

    type Course {
        id: UUID!
        name: String!
        category: String!
        description: String!
        preview: String!
        contentTotalIsEstimatedCount: Int!
        progressCourse: Int!
        contentTotalDoneCount: Int!
        createdAt: Timestamp!
        updatedAt: Timestamp!
        lessons: [Lesson!]!
    }

    input LessonInput {
        name: String!
        content: JSON!
        orderBy: Int!
    }

    type Lesson {
        id: UUID!
        name: String!
        content: JSON!
        contentIsEstimatedCount: Int!
        contentTotal: Int!
        contentTotalIsEstimated: Int!
        orderBy: Int!
        nextLessonId: UUID
        prevLessonId: UUID
        createdAt: Timestamp!
        updatedAt: Timestamp!
        course: Course!
        userProgress: UserProgress
    }

    type UserProgress {
        contentTotalDone: Int!
        contentTotalDonePercent: Int!
        results: [Progress!]!
    }

`;
