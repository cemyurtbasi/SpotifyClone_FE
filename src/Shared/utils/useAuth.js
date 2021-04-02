import { useState, useEffect } from "react";
import PublicService from "../../Store/public";

const code = new URLSearchParams(window.location.search).get("code");
const publicService = new PublicService();

export default function useAuth() {
  const [authData, setAuthData] = useState({
    accessToken: null,
    refreshToken: null,
    expiresIn: null,
  });


  useEffect(() => {
    publicService
      .userLogin({ code })
      .then((res) => {
        setAuthData(res);
        window.history.pushState({}, null, "/play");
      })
      .catch(() => {
        window.location = "/";
      });
  }, []);

  useEffect(() => {
    const { expiresIn, refreshToken } = authData;

    if (!refreshToken || !expiresIn) return;

    const interval = setInterval(() => {
      publicService
        .refreshToken({ refreshToken })
        .then((res) => {
          setAuthData((prev) => ({ ...prev, ...res }));
        })
        .catch(() => {
          window.location = "/";
        });
    }, (expiresIn - 60) * 1000);

    return () => clearInterval(interval);
  }, [authData]);

  return authData.accessToken;
}
