// import reactjs
import { LoadingContext } from "contexts/LoadingContext";
import "./LoadingOverlay.scss";
import React from "react";

export default function LoadingOverlay() {
  //use loading context
  const { loading } = React.useContext(LoadingContext);

  return (
    <>
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner" />
        </div>
      )}
    </>
  );
}
