import { useQuery } from '@apollo/client';

import FoodieList from '../components/FoodieList';

import { QUERY_FOODIES } from '../utils/queries';

const Home = () => {
  const { loading, data } = useQuery(QUERY_FOODIES);
  const foodies = data?.foodies || [];

  return (
    <main>
     
    </main>
  );
};

export default Home;