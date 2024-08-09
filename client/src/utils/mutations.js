import { gql } from '@apollo/client';

export const ADD_FOODIE = gql`
  mutation addFoodie($username: String!, $email: String!, $password: String!) {
    addFoodie(username: $username, email: $email, password: $password) {
      token
      foodie {
        _id
        username
      }
    }
  }
`;

export const LOGIN_FOODIE = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      foodie {
        _id
        username
      }
    }
  }
`;
