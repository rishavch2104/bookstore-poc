import gql from 'graphql-tag';

export const typeDefs = gql`
  scalar Date

  type Review {
    id: ID!
    bookId: Int!
    userId: Int!
    rating: Int!
    title: String
    body: String
    createdAt: Date!
    updatedAt: Date!
    user: User!
  }

  type ReviewList {
    nodes: [Review!]!
    totalCount: Int!
    hasNextPage: Boolean!
  }

  type RatingSummary {
    count: Int!
    average: Float!
  }

  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Author {
    id: ID!
    name: String!
    bio: String
    dateOfBirth: Date!
    books: [Book!]!
  }

  type Book {
    id: ID!
    title: String!
    description: String!
    authorId: Int!
    author: Author!
    publishedDate: Date!
  }

  extend type Book {
    ratingSummary: RatingSummary!
    reviews(limit: Int = 10, offset: Int = 0): ReviewList!
  }

  type AuthorList {
    nodes: [Author!]!
    totalCount: Int!
    hasNextPage: Boolean!
  }

  type BookList {
    nodes: [Book!]!
    totalCount: Int!
    hasNextPage: Boolean!
  }

  input AuthorFilter {
    id: ID
    name: String
    dateOfBirth: Date
    dateOfBirthFrom: Date
    dateOfBirthTo: Date
    books: BookFilter
  }

  input BookFilter {
    id: ID
    title: String
    authorId: Int
    publishedDate: Date
    publishedDateFrom: Date
    publishedDateTo: Date
    author: AuthorFilter
  }

  enum OrderDirection {
    ASC
    DESC
  }

  enum AuthorOrderField {
    ID
    NAME
    DATE_OF_BIRTH
    CREATED_AT
    UPDATED_AT
  }
  input AuthorOrder {
    field: AuthorOrderField! = ID
    direction: OrderDirection! = ASC
  }

  enum BookOrderField {
    ID
    TITLE
    AUTHOR_ID
    PUBLISHED_DATE
    CREATED_AT
    UPDATED_AT
  }
  input BookOrder {
    field: BookOrderField! = ID
    direction: OrderDirection! = ASC
  }

  type Query {
    authors(
      limit: Int = 20
      offset: Int = 0
      filter: AuthorFilter
      orderBy: [AuthorOrder!]
    ): AuthorList!

    books(
      limit: Int = 20
      offset: Int = 0
      filter: BookFilter
      orderBy: [BookOrder!]
    ): BookList!

    author(id: ID!): Author
    book(id: ID!): Book
  }

  input CreateAuthorInput {
    name: String!
    bio: String
    dateOfBirth: Date!
  }
  input UpdateAuthorInput {
    id: ID!
    name: String
    bio: String
    dateOfBirth: Date
  }
  input DeleteAuthorInput {
    id: ID!
  }

  input CreateBookInput {
    title: String!
    description: String!
    authorId: Int!
    publishedDate: Date!
  }
  input UpdateBookInput {
    id: ID!
    title: String
    description: String
    authorId: Int
    publishedDate: Date
  }
  input DeleteBookInput {
    id: ID!
  }

  input CreateReviewInput {
    bookId: Int!
    userId: Int!
    rating: Int!
    title: String
    body: String
  }

  input UpdateReviewInput {
    id: ID!
    rating: Int
    title: String
    body: String
  }

  input DeleteReviewInput {
    id: ID!
  }

  type Mutation {
    createAuthor(input: CreateAuthorInput!): Author!
    updateAuthor(input: UpdateAuthorInput!): Author!
    deleteAuthor(input: DeleteAuthorInput!): Boolean!

    createBook(input: CreateBookInput!): Book!
    updateBook(input: UpdateBookInput!): Book!
    deleteBook(input: DeleteBookInput!): Boolean!
  }

  extend type Query {
    reviews(bookId: Int!, limit: Int = 10, offset: Int = 0): ReviewList!
  }

  extend type Mutation {
    createReview(input: CreateReviewInput!): Review!
    updateReview(input: UpdateReviewInput!): Review!
    deleteReview(input: DeleteReviewInput!): Boolean!
  }
`;
