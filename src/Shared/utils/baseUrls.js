export  function getBaseServiceUrl() {
  const host = window.location.hostname;
  return host.includes("localhost")
    ? process.env.REACT_APP_API_URL_LOCALE
    : process.env.REACT_APP_API_URL;
}
export  function getBaseAuthUrl() {
  const host = window.location.hostname;
  return host.includes("localhost")
    ? process.env.REACT_APP_AUTH_URL_LOCALE
    : process.env.REACT_APP_AUTH_URL;
}
