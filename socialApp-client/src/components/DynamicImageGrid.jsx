import { Row, Col, Image } from "react-bootstrap";

export default function DynamicImageGrid({ id_no }) {
  const images = [];

  for (let i = id_no; i < id_no + 6; i++) {
    images.push(`https://picsum.photos/id/${i}/500/500`);
  }
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
