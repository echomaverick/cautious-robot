import { Col, Row, Container, Image, Button } from "react-bootstrap";
import { useContext } from "react";
import { ProfileContext } from "./Profile";

export default function ProfileHeader() {
  const {
    image,
    name,
    posts_no,
    followers,
    following,
    subheader,
    account_type: accountType,
    description,
    link,
  } = useContext(ProfileContext);

  return (
    <Row className="p-5">
      <Col md={3} className="d-flex align-items-center justify-content-center">
        <Image
          src={image}
          roundedCircle
          style={{ width: "150px", marginTop: 13 }}
        ></Image>
      </Col>
      <Col md={9}>
        <span className="me-4" style={{ fontSize: "20px" }}>
          {name}
        </span>

        <br />
        <br />
        <span className="me-4" style={{ fontSize: ".8em" }}>
          <strong>{posts_no}</strong> posts
        </span>
        <span className="me-4" style={{ fontSize: ".8em" }}>
          <strong>{followers}</strong> followers
        </span>
        <span className="me-4" style={{ fontSize: ".8em" }}>
          <strong>{following}</strong> following
        </span>
        <br />
        <br />
        <p style={{ margin: 0, fontWeight: "bold" }}>{subheader}</p>
        <p style={{ margin: 0, color: "grey" }}>{accountType}</p>
        <p style={{ margin: 0 }}>{description}</p>
        <a href={link} target="_blank">
          {link}
        </a>
      </Col>
    </Row>
  );
}
