import axios from "axios";
import headers from "/util/headers";
import { errorHandle } from "/util/helper";

const APIURL = `${process.env.REACT_APP_API_URL}/dashboard`;

console.log(process);

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

//get total earn whole works
export const getTotalEarnData = async (year) => {
  try {
    const response = await axios.get(`${APIURL}/getTotalEarn`, {
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

//get total expense whole expense
export const getTotalExpenseData = async (year) => {
  try {
    const response = await axios.get(`${APIURL}/getTotalExpense`, {
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

export const getYearsReportData = async () => {
  try {
    const response = await axios.get(`${APIURL}/getYearsReport`, {
      headers: headers(),
    });
    return response.data;
  } catch (error) {
    return await errorHandle(error);
  }
};

export const getTotalWorkData = async (year) => {
  try {
    const response = await axios.get(`${APIURL}/getTotalWork`, {
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

export const getDashboardData = async () => {
  try {
    const response = await axios.get(`${APIURL}/getDashboard`, {
      headers: headers(),
    });
    return response.data;
  } catch (error) {
    return await errorHandle(error);
  }
};
