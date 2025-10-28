import gql from 'graphql-tag';

export const userTypeDefs = gql`
  type User {
    id: ID!
    email: String!
    role: UserRole!
  }
  extend type User {
    reviews(limit: Int = 10, offset: Int = 0): ReviewList!
  }

  input CreateUserInput {
    email: String!
    password: String!
    role: UserRole
  }

  input UpdateUserInput {
    email: String
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
