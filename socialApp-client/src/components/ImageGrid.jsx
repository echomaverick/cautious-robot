import { useContext } from "react";
import { Row, Col, Image } from "react-bootstrap";
import { ProfileContext } from "./Profile";

export default function ImageGrid() {
  const images = useContext(ProfileContext).posts.map((post) => post.image);
  console.log("IMAGES RESULT FROM IMAGEGRID", images);

  const renderImages = () => {
    return images.map((imageUrl, index) => (
      <Col xs={12} md={4} key={index} className="mb-4">
        <Image src={imageUrl} fluid></Image>
      </Col>
    ));
  };

  return <Row>{renderImages()}</Row>;
}
