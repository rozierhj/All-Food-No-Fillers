import { useQuery } from '@apollo/client';

import FoodieList from '../components/FoodieList';

import { QUERY_FOODIES } from '../utils/queries';

const Home = () => {
  const { loading, data } = useQuery(QUERY_FOODIES);
  const foodies = data?.foodies || [];

  return (
    <main>
      <div className="flex-row justify-center">
        <div className="col-12 col-md-10 my-3">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <FoodieList
              foodies={foodies}
              title="Here's the current roster of friends..."
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;