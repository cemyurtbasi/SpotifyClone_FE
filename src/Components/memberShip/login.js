import React from "react";
import "./css/login.scss";

const Login = (props) => {
  return (
    <div className="login">
      <a className="login__btn" href={process.env.REACT_APP_AUTH_URL}>
        Spotify İle Giriş Yap
      </a>
    </div>
  );
};

export default Login;
