// import { useContext } from "react";
// import { Row, Col, Image, Container } from "react-bootstrap";
// import { ProfileContext } from "./Profile";

// export default function StoryHighlights() {
//   const highlights = useContext(ProfileContext).highlights.map((story) => {
//     return {
//       story_img: story.image,
//       story_description: story.description,
//     };
//   });
//   console.log("HIGHLIGHTS RESULT", highlights);

//   function renderImages() {
//     return highlights.map((imageDetails, index) => (
//       <Col
//         md={3}
//         key={index}
//         className="mb-4 d-flex flex-column align-items-center justify-content-center highlight-column highlight-column:hover mx-2"
//         style={{ cursor: "pointer" }}
//       >
//         <Image
//           style={{ width: "75px", marginBottom: "1rem" }}
//           src={imageDetails.story_img}
//         ></Image>
//         <p>
//           <strong>{imageDetails.story_description}</strong>
//         </p>
//       </Col>
//     ));
//   }

//   return (
//     <Row>
//       <Container
//         className="d-flex justify-content-center"
//         style={{ border: "none" }}
//       >
//         {renderImages()}
//       </Container>
//     </Row>
//   );
// }
