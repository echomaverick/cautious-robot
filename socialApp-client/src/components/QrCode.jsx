import React from "react";
import QRCode from "qrcode.react";
import { useParams } from "react-router-dom";

const QRCodePage = () => {
  const { username } = useParams();
  const profileUrl = `http://localhost:5173/${username}`;

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Show this QR Code to Your Friends</h1>
      <QRCode value={profileUrl} />
      <p>Give this QR code to your friends to scan it and follow you.</p>
    </div>
  );
};

export default QRCodePage;
