const Card = ({ children }: any) => {
  return (
    <div className="card w-full bg-white shadow-xl text-black">
      <div className="card-body">{children}</div>
    </div>
  );
};

export default Card;
