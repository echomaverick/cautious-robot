import React, { useEffect } from "react";
import "../styles/coming-soon.css";

const ComingSoon = () => {
  useEffect(() => {
    document.body.classList.add("soon-page");
    return () => {
      document.body.classList.remove("soon-page");
    };
  }, []);

  return <div className="soon">Coming Soon!</div>;
};

export default ComingSoon;
