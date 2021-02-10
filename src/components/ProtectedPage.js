import React from "react";
import { Redirect, Route } from "react-router-dom";

const ProtectedPage = ({ component: Component, ...rest }) => {
  console.log("Authenticated Page ", sessionStorage.getItem("token"));
  return (
    <Route
      {...rest}
      render={(props) =>
        sessionStorage.getItem("token") ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: "/", state: { from: props.location } }} />
        )
      }
    />
  );
};

export default ProtectedPage;
