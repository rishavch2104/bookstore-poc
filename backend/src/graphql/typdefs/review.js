import gql from 'graphql-tag';

export const reviewTypeDefs = gql`
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

  input CreateReviewInput {
    bookId: Int!
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

  extend type Query {
    reviews(bookId: Int!, limit: Int = 10, offset: Int = 0): ReviewList!
  }

  extend type Mutation {
    createReview(input: CreateReviewInput!): Review!
    updateReview(input: UpdateReviewInput!): Review!
    deleteReview(input: DeleteReviewInput!): Boolean!
  }
`;
