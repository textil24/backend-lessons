export const typeDefs = `#graphql
    scalar UUID
    scalar Timestamp
    scalar JSON

    type Query {
        getCourses: [Course!]!
        getCourse(id: UUID!): Course!
        getLessons: [Lesson!]!
        getLesson(id: UUID!): Lesson!
    }

    type Mutation {
        createCourse(input: CourseInput!): Course!
        createLesson(input: LessonInput!): Lesson!
        updateLesson(id: UUID!, input: LessonInput!): Lesson!
        deleteLesson(id: UUID!): Lesson!
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
        createdAt: Timestamp!
        updatedAt: Timestamp!
        lessons: [Lesson!]!
    }

    input LessonInput {
        name: String!
        content: JSON!
        orderBy: Int!
        # nextLessonId: UUID
        # prevLessonId: UUID
    }

    type Lesson {
        id: UUID!
        name: String!
        content: JSON!
        orderBy: Int!
        nextLessonId: UUID
        prevLessonId: UUID
        createdAt: Timestamp!
        updatedAt: Timestamp!
        courseId: String!
        course: Course!
    }

`