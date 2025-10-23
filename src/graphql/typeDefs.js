import { gql } from 'graphql-tag';

export const typeDefs = gql`
  scalar Date

  type Author {
    id: ID!
    name: String!
    bio: String
    books: [Book!]!
  }

  type Book {
    id: ID!
    title: String!
    authorId: Int!
    author: Author!
    publishedYear: Int!
    genre: String!
  }

  type Query {
    authors: [Author!]!
    author(id: ID!): Author
    books: [Book!]!
    book(id: ID!): Book
  }

  input CreateAuthorInput {
    name: String!
    bio: String
  }

  input CreateBookInput {
    title: String!
    authorId: Int!
    genre: String!
  }

  input DeleteAuthorInput {
    id: ID!
  }

  input DeleteBookInput {
    id: ID!
  }

  input UpdateAuthorInput {
    id: ID!
    name: String
    bio: String
  }

  input UpdateBookInput {
    id: ID!
    title: String
    authorId: Int
    genre: String
  }

  type Mutation {
    createAuthor(input: CreateAuthorInput!): Author!
    createBook(input: CreateBookInput!): Book!
    deleteAuthor(input: DeleteAuthorInput!): Boolean!
    deleteBook(input: DeleteBookInput!): Boolean!
    updateAuthor(input: UpdateAuthorInput!): Author!
    updateBook(input: UpdateBookInput!): Book!
  }
`;
