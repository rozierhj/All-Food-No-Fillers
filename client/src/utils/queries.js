import { gql } from '@apollo/client';

export const QUERY_FOODIES = gql`
  query allFoodies {
    foodies {
      _id
      username
    }
  }
`;

export const QUERY_SINGLE_FOODIE = gql`
  query singleFoodie($foodieId: ID!) {
    foodie(foodieId: $foodieId) {
      _id
      username
    }
  }
`;

export const QUERY_CURRENT_FOODIE = gql`
  query currentFoodie {
    currentFoodie {
      _id
      username
    }
  }
`;