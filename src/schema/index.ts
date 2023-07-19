export const typeDefs = `#graphql
    scalar UUID
    scalar Timestamp

    type Query {
        lessons: [Lesson!]!
        # card(id: Int!): Card!
    }

    type Mutation {
        createLesson(input: LessonInput!): Lesson!
    }

    input LessonInput {
        name: String!
        content: String!
        nextLessonId: UUID
        prevLessonId: UUID
    }

    type Lesson {
        id: ID!
        name: String!
        content: String!
        nextLessonId: UUID
        prevLessonId: UUID
        createdAt: Timestamp!
        updatedAt: Timestamp!
    }

`