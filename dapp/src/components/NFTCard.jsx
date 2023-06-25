
const NFTCard = ({ nftDetails }) => {
  
  const { name, description, image } = nftDetails;

  return (
    <div className="">
      <div className="">
        <img style={{ borderColor: "red" }} src={image} alt="NftImage" />
      </div>
      <div className="">
        <h3>Name: {name}</h3>
        <p>Description: {description}</p>
      </div>
    </div>
  );
};

export default NFTCard;