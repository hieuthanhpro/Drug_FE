import fetchIntercept from "fetch-intercept";
import { useCookies } from "react-cookie";
import { getCookie } from "utils/common";
import { urlsFormData } from "./urls";
export default function RegisterFetch() {
  const [cookies, setCookie, removeCookie] = useCookies();
  return fetchIntercept.register({
    request(url, config) {
      if (!config) {
        config = {};
      }
      if (!config.headers) {
        config.headers = {};
      }
      const token = getCookie("token");
      if (token) {
        config.headers["Token"] = `${token}`;
      }
      if (!config.headers.Accept) {
        config.headers.Accept = "application/json";
      }
      if (!config.headers["Content-Type"]) {
        config.headers["Content-Type"] = "application/json";
      }
      if (urlsFormData.filter((urlForm) => url.indexOf(urlForm) !== -1).length > 0) {
        delete config.headers["Content-Type"];
      }
      if (!url.startsWith("http")) {
        if (!url.startsWith("/")) {
          url = `/${url}`;
        }
        if (url.indexOf(".hot-update.json") === -1) {
          url = process.env.APP_API_URL + url;
        }
      }
      return [url, config];
    },

    requestError(error) {
      return Promise.reject(error);
    },

    response(response) {
      if (response.status === 401) {
        if (cookies.user) {
          removeCookie("user", { path: "/" });
        }
        if (cookies.token) {
          removeCookie("token", { path: "/" });
        }
        if (cookies.drugStore) {
          removeCookie("drugStore", { path: "/" });
        }
      }
      return response;
    },

    responseError(error) {
      return Promise.reject(error);
    },
  });
}
