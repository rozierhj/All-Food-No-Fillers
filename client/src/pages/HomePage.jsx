import { useQuery } from '@apollo/client';
import { FoodList } from '../components/FoodList';
// import { RecipeCard } from '../components/RecipeCard';
import { Search } from '../components/Search'

import FoodieList from '../components/FoodieList';

import { QUERY_FOODIES } from '../utils/queries';

const Home = () => {
  const { loading, data } = useQuery(QUERY_FOODIES);
  const foodies = data?.foodies || [];

  return (
    <main>
     <Search />
     <FoodList />
    </main>
  );
};

export default Home;