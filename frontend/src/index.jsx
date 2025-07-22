import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { GoogleOAuthProvider } from '@react-oauth/google';

// Mets ici ta vraie Client ID Google
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>
);
