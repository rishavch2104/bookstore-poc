import gql from 'graphql-tag';

export const bookTypeDefs = gql`
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

  type BookList {
    nodes: [Book!]!
    totalCount: Int!
    hasNextPage: Boolean!
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
  input BookOrder {
    field: BookOrderField! = ID
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

  extend type Query {
    books(
      limit: Int = 20
      offset: Int = 0
      filter: BookFilter
      orderBy: [BookOrder!]
    ): BookList!

    book(id: ID!): Book
  }

  extend type Mutation {
    createBook(input: CreateBookInput!): Book!
    updateBook(input: UpdateBookInput!): Book!
    deleteBook(input: DeleteBookInput!): Boolean!
  }
`;
