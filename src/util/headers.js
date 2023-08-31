import errorHandler from "./errorHandler";
import { store } from "/redux/store";
export default function headers() {
  const user = store.getState().auth.user;
  const accessToken = user ? user.accessToken : null;
  if (accessToken == null)
    return errorHandler({
      errorCode: 500,
      errorMessage: "Dont Have AccessToken",
    });
  return {
    "content-type": "application/json",
    Authorization: accessToken,
    Accept: "application/json",
    "Access-Control-Allow-Origin": "*",
    "Request-Timeout": "60000",
  };
}
