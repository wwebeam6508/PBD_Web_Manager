import axios from "axios";
import headers from "util/headers";
import { errorHandle } from "util/helper";

const APIURL = `${process.env.REACT_APP_API_URL}/dashboard`;

export const getEarnAndSpendEachYearData = async (year) => {
  try {
    const response = await axios.get(`${APIURL}/getEarnAndSpendEachYear`, {
      headers: headers(),
      params: {
        year,
      },
    });
    return response.data;
  } catch (error) {
    return await errorHandle(error);
  }
};
