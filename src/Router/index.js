import React from "react";
import { BrowserRouter , Switch, Route } from "react-router-dom";
import SpotiyfAuth from "../Components/spotiyfAuth";
import PlayList from "../Components/playList";

const Router = () => {
  return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={SpotiyfAuth} />
          <Route exact path="/play" component={PlayList} />
          <Route path="*">
            <div>404</div>
          </Route>
        </Switch>
      </BrowserRouter>
  );
};

export default Router;
