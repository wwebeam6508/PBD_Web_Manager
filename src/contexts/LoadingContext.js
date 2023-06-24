import React from "react";

const LoadingContext = React.createContext();

//create LoadingProvider functionlal component
function LoadingProvider({ children }) {

  //create loading state
  const [loading, setLoading] = React.useState(false);

  const showLoading = () => {
    setLoading(true);
  };

  const hideLoading = () => {
    setLoading(false);
  };

  const value = { loading, showLoading, hideLoading };

  return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>;
}

export { LoadingProvider, LoadingContext };