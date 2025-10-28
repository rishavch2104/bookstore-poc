import { gql } from '@apollo/client';

export const createReviewQuery = gql`
  mutation CreateReview($input: CreateReviewInput!) {
    createReview(input: $input) {
      id
      bookId
      userId
      rating
      title
      body
      createdAt
    }
  }
`;
