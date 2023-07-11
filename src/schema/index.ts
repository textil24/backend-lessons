export const typeDefs = `#graphql

    type Query {
        cards: [Card!]!
    }

    type Mutation {
        createCard(input: CardInput): Card
    }

    input CardInput {
        title: String!
        text: String!
    }

    type Card {
        id: Int!
        title: String!
        text: String!
    }

`