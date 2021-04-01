import React from "react";
import { getBaseAuthUrl } from "../../Shared/utils/baseUrls";
import "./css/login.scss";

const Login = (props) => {
  return (
    <div className="login">
      <a className="login__btn" href={getBaseAuthUrl()}>
        Spotify İle Giriş Yap
      </a>
    </div>
  );
};

export default Login;
