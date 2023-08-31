import axios from "axios";
import { setAuth, setLogout } from "./authSlice";
import { errorHandle } from "/util/helper";
export const login = (username, password) => async (dispatch) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/auth/login`,
      { username, password }
    );
    dispatch(setAuth(response.data.data));
  } catch (error) {
    errorHandle(error);
  }
};

export const logout =
  ({ userID }) =>
  async (dispatch) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/auth/logout`, {
        userID,
      });
      dispatch(setLogout());
    } catch (error) {
      errorHandle(error);
    }
  };
