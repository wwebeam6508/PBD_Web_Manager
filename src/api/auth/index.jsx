import axios from "axios";
import headers from "/util/headers";
import { errorHandle } from "/util/helper";
import { store } from "/redux/store";
import { setUserToken } from "/redux/auth/authSlice";

const APIURL = `${process.env.REACT_APP_API_URL}/auth`;
export async function fetchUserData(user) {
  if (user == null) {
    throw false;
  }
  const requestOption = {
    headers: headers(),
    params: {
      userID: user.userProfile.userID,
    },
  };
  try {
    const res = await axios.get(`${APIURL}/fetchuser`, requestOption);
    const passToken = {
      accessToken: res.data.data.accessToken,
      refreshToken: res.data.data.refreshToken,
    };
    await store.dispatch(setUserToken(passToken));
    return true;
  } catch (error) {
    return await errorHandle(error);
  }
}
