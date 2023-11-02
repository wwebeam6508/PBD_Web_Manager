import axios from "axios";
import headers from "/util/headers";
import { errorHandle } from "/util/helper";
import { store } from "/redux/store";
import { setUserProfile } from "/redux/auth/authSlice";

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
    await store.dispatch(setUserProfile(res.data.data));
    return true;
  } catch (error) {
    return await errorHandle(error);
  }
}

export async function changePasswordData(data) {
  const requestOption = {
    headers: headers(),
  };
  try {
    await axios.post(`${APIURL}/changepassword`, data, requestOption);
    return true;
  } catch (error) {
    return await errorHandle(error);
  }
}
