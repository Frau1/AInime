const StarRating = ({ rating }: { rating: number }) => {
  const full = Math.floor(rating / 2);
  const half = (rating / 2) % 1 >= 0.5;

  return (
    <span className="stars">
      {'★'.repeat(full)}
      {half ? '½' : ''}
      {'☆'.repeat(5 - full - (half ? 1 : 0))}
      <span style={{ color: '#ffcc00', fontWeight: 700, marginLeft: 6, fontSize: 14 }}>
        {rating}
      </span>
    </span>
  );
};

export default StarRating; // 