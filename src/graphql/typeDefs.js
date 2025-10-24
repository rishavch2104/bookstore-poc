import gql from 'graphql-tag';

export const typeDefs = gql`
  scalar Date
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

  type Mutation {
    createAuthor(input: CreateAuthorInput!): Author!
    updateAuthor(input: UpdateAuthorInput!): Author!
    deleteAuthor(input: DeleteAuthorInput!): Boolean!

    createBook(input: CreateBookInput!): Book!
    updateBook(input: UpdateBookInput!): Book!
    deleteBook(input: DeleteBookInput!): Boolean!
  }
`;
