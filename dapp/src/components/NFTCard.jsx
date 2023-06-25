
const NFTCard = ({ nftDetails }) => {
  
  const { name, description, image } = nftDetails;

  return (
    <div className="">
      <div className="">
        <h3>{name}</h3>
        <p>{description}</p>
      </div>
      <div className="">
        <img style={{ borderColor: "red" }} src={image} alt="NftImage" />
      </div>
    </div>
  );
};

export default NFTCard;