import React from "react";
import Login from "../Components/memberShip/login";
import PlayList from "../Components/playList";

const code = new URLSearchParams(window.location.search).get("code");

const Router = () => {
  return code ? <PlayList code={code} /> : <Login />;
};

export default Router;
