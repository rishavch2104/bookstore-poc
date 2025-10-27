import gql from 'graphql-tag';

export const userTypeDefs = gql`
  type User {
    id: ID!
    name: String!
    userName: String!
  }
  extend type User {
    reviews(limit: Int = 10, offset: Int = 0): ReviewList!
  }

  input CreateUserInput {
    name: String!
    userName: String!
  }

  input UpdateUserInput {
    name: String
    userName: String
  }

  input DeleteUserInput {
    id: ID!
  }

  extend type Query {
    user(id: ID!, limit: Int = 20, offset: Int = 0): User!
  }

  extend type Mutation {
    createUser(input: CreateUserInput!): User!
    updateUser(input: UpdateUserInput!): User!
    deleteUser(input: DeleteUserInput!): User!
  }
`;
