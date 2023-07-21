export const typeDefs = `#graphql
    scalar UUID
    scalar Timestamp
    scalar JSON

    type Query {
        getLessons: [Lesson!]!
        getLesson(id: UUID!): Lesson!
    }

    type Mutation {
        createLesson(input: LessonInput!): Lesson!
        updateLesson(id: UUID!, input: LessonInput!): Lesson!
        deleteLesson(id: UUID!): Lesson!
    }

    input LessonInput {
        name: String!
        content: JSON!
        nextLessonId: UUID
        prevLessonId: UUID
    }

    type Lesson {
        id: UUID!
        name: String!
        content: JSON!
        nextLessonId: UUID
        prevLessonId: UUID
        createdAt: Timestamp!
        updatedAt: Timestamp!
    }

`