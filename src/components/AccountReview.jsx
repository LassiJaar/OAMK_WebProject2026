const AccountReview = ({ review }) => {
  return (
    <div>
      <h1>{review.movie_id}</h1>
      <p>{review.rating}/5</p>
      <p>{review.text}</p>
    </div>
  );
};

export default AccountReview;
