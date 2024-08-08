import { Link } from 'react-router-dom';

const FoodieList = ({ foodies}) => {
  if (!foodies.length) {
    return <h3>No Profiles Yet</h3>;
  }

  return (
    <div>
      <h3 className="text-primary"></h3>
      <div className="flex-row justify-space-between my-4">
        {foodies &&
          foodies.map((foodie) => (
            <div key={foodie._id} className="col-12 col-xl-6">
              <div className="card mb-3">
                <h4 className="card-header bg-dark text-light p-2 m-0">
                  {foodie.username} <br />
                </h4>

                <Link
                  className="btn btn-block btn-squared btn-light text-dark"
                  to={`/profiles/${foodie._id}`}
                >
                  View and endorse their skills.
                </Link>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default FoodieList;
