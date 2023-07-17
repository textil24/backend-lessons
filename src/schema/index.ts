export const typeDefs = `#graphql

    type Query {
        cards: [Card!]!
        card(id: Int!): Card
    }

    type Mutation {
        createCard(input: CardInput): Card
        updateCard(id: Int!, input: CardInput): Card
        deleteCard(id: Int!): Card
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