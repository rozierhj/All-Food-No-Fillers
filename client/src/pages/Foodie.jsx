import { Navigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

// import SkillsList from '../components/SkillsList';
// import SkillForm from '../components/SkillForm';

import { QUERY_SINGLE_FOODIE, QUERY_CURRENT_FOODIE } from '../utils/queries';

import Auth from '../utils/auth';

const Foodie = () => {
  const { foodieId } = useParams();

  // If there is no `profileId` in the URL as a parameter, execute the `QUERY_ME` query instead for the logged in user's information
  const { loading, data } = useQuery(
    foodieId ? QUERY_SINGLE_FOODIE : QUERY_CURRENT_FOODIE,
    {
      variables: { foodieId: foodieId },
    }
  );

  // Check if data is returning from the `QUERY_ME` query, then the `QUERY_SINGLE_PROFILE` query
  const foodie = data?.currnetFoodie || data?.foodie || {};

  // Use React Router's `<Navigate />` component to redirect to personal profile page if username is yours
  if (Auth.loggedIn() && Auth.getProfile().data._id === foodieId) {
    return <Navigate to="/currentFoodie" />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!foodie?.username) {
    return (
      <h4>
        You need to be logged in to see your profile page. Use the navigation
        links above to sign up or log in!
      </h4>
    );
  }

  return (
    <div>
      <h2 className="card-header">
        Maybe we'll put the recipies here
      </h2>
    </div>
  );
};

export default Foodie;