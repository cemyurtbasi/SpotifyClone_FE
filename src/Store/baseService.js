import axios from "axios";

export default class baseService {
  constructor() {
    const host = window.location.host;

    if (host.includes("localhost"))
      this.apiURL = process.env.REACT_APP_API_URL_LOCALE;
    else {
      this.apiURL = process.env.REACT_APP_API_URL;
    }
  }

  postObject(funcName, entity) {
    var url = this.apiURL + "/" + funcName;
    return this.callServiceMethod(url, entity, "POST");
  }

  getObject(funcName, data) {
    var url = this.apiURL + "/" + funcName + "?" + (data ? data : "");
    return this.callServiceMethod(url, data, "GET");
  }

  callServiceMethod(url, data, method) {
    return this.callAnyServiceMethod(url, data, method);
  }

  async callAnyServiceMethod(url, data, method) {
    var authOptions = {
      method,
      url,
      data,
    };

    return await axios(authOptions).then((response) => {
      return response.data;
    });
  }
}
