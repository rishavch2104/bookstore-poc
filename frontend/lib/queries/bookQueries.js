import { gql } from '@apollo/client';

export const createBookQuery = gql`
  mutation CreateBook($input: CreateBookInput!) {
    createBook(input: $input) {
      id
      title
    }
  }
`;
export const deleteBookQuery = gql`
  mutation DeleteBook($input: DeleteBookInput!) {
    deleteBook(input: $input)
  }
`;

export const updateBookQuery = gql`
  mutation UpdateBook($input: UpdateBookInput!) {
    updateBook(input: $input) {
      id
      title
    }
  }
`;

export const getBookQuery = gql`
  query GetBookWithReviewsPage($id: ID!, $limit: Int!, $offset: Int!) {
    book(id: $id) {
      id
      title
      publishedDate
      description
      author {
        id
        name
      }
      ratingSummary {
        count
        average
      }
      reviews(limit: $limit, offset: $offset) {
        totalCount
        hasNextPage
        nodes {
          id
          userId
          rating
          title
          body
          createdAt
        }
      }
    }
  }
`;

export const getBookPageQuery = gql`
  query GetBooksPageFiltered(
    $limit: Int!
    $offset: Int!
    $filter: BookFilter
    $orderBy: [BookOrder!]
  ) {
    books(limit: $limit, offset: $offset, filter: $filter, orderBy: $orderBy) {
      totalCount
      hasNextPage
      nodes {
        id
        title
        publishedDate
        author {
          id
          name
        }
      }
    }
  }
`;
