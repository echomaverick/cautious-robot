import ImageGrid from "./ImageGrid";
import DynamicImageGrid from "./DynamicImageGrid";
import { Tab, Tabs } from "react-bootstrap";
import { useState } from "react";

function TabsSection() {
  const [activeTab, setActiveTab] = useState("posts");

  const tabStyles = {
    default: { color: "grey" },
    active: { color: "blue" },
  };

  return (
    <div className="d-flex flex-column justify-content-center">
      <Tabs
        defaultActiveKey="posts"
        id="controlled-tab"
        activeKey={activeTab}
        onSelect={(tab) => setActiveTab(tab)}
        className="mb-3 mx-auto"
      >
        <Tab
          eventKey="posts"
          href="/posts"
          title={
            <span
              style={
                activeTab === "posts" ? tabStyles.active : tabStyles.default
              }
            >
              <i className={"bi bi-grid pe-2"} style={{ fontSize: "16px" }}></i>
              POSTS
            </span>
          }
        >
          <DynamicImageGrid id_no={120} />
        </Tab>
        <Tab
          eventKey="reels"
          href="/reels"
          title={
            <span
              style={
                activeTab === "reels" ? tabStyles.active : tabStyles.default
              }
            >
              <i
                className={"bi bi-play-btn p-2"}
                style={{ fontSize: "16px" }}
              ></i>
              REELS
            </span>
          }
        >
          <DynamicImageGrid id_no={10} />
        </Tab>
        <Tab
          eventKey="saved"
          href="/saved"
          title={
            <span
              style={
                activeTab === "saved" ? tabStyles.active : tabStyles.default
              }
            >
              <i
                className={"bi bi-bookmark pe-2"}
                style={{ fontSize: "16px" }}
              ></i>
              SAVED
            </span>
          }
        >
          <DynamicImageGrid id_no={20} />
        </Tab>
        <Tab
          eventKey="tagged"
          href="/tagged"
          title={
            <span
              style={
                activeTab === "tagged" ? tabStyles.active : tabStyles.default
              }
            >
              <i
                className={"bi bi-person-circle pe-2"}
                style={{ fontSize: "16px" }}
              ></i>
              TAGGED
            </span>
          }
        >
          <DynamicImageGrid id_no={40} />
        </Tab>
      </Tabs>
    </div>
  );
}

export default TabsSection;
