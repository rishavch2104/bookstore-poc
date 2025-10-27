import gql from 'graphql-tag';

export const authorTypeDefs = gql`
  type Author {
    id: ID!
    name: String!
    bio: String
    dateOfBirth: Date!
    books: [Book!]!
  }

  type AuthorList {
    nodes: [Author!]!
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

  input AuthorOrder {
    field: AuthorOrderField! = ID
    direction: OrderDirection! = ASC
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

  enum AuthorOrderField {
    ID
    NAME
    DATE_OF_BIRTH
    CREATED_AT
    UPDATED_AT
  }

  extend type Query {
    authors(
      limit: Int = 20
      offset: Int = 0
      filter: AuthorFilter
      orderBy: [AuthorOrder!]
    ): AuthorList!

    author(id: ID!): Author
  }

  extend type Mutation {
    createAuthor(input: CreateAuthorInput!): Author!
    updateAuthor(input: UpdateAuthorInput!): Author!
    deleteAuthor(input: DeleteAuthorInput!): Boolean!
  }
`;
