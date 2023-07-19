export const typeDefs = `#graphql

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
        nextLessonId: ID
        prevLessonId: ID
    }

    type Lesson {
        id: ID!
        name: String!
        content: String!
        nextLessonId: ID
        prevLessonId: ID
        createdAt: String!
        updatedAt: String!
    }

`