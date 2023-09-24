import axios from "axios";
import headers from "/util/headers";
import { isEmpty } from "/util/helper";
import { errorHandle } from "/util/helper";

const APIURL = `${process.env.REACT_APP_API_URL}/customermanagement`;
export const getCustomers = async ({ page, pageSize, sortTitle, sortType }) => {
  let requestOption = {
    headers: headers(),
    params: {
      page: page,
      pageSize: pageSize,
    },
  };
  if (!isEmpty(sortTitle) && !isEmpty(sortType)) {
    requestOption.params.sortTitle = sortTitle;
    requestOption.params.sortType = sortType;
  }
  try {
    const response = await axios.get(`${APIURL}/get`, requestOption);
    return response.data;
  } catch (error) {
    return await errorHandle(error);
  }
};

export const getCustomerByID = async (id) => {
  try {
    const response = await axios.get(`${APIURL}/getByID`, {
      headers: headers(),
      params: {
        customerID: id,
      },
    });
    return response.data;
  } catch (error) {
    return await errorHandle(error);
  }
};

export const addCustomer = async (formData) => {
  try {
    const response = await axios.post(`${APIURL}/add`, formData, {
      headers: headers(),
    });
    return response.data;
  } catch (error) {
    return await errorHandle(error);
  }
};

export const updateCustomer = async (formData) => {
  try {
    const response = await axios.post(`${APIURL}/update`, formData, {
      headers: headers(),
    });
    return response.data;
  } catch (error) {
    return await errorHandle(error);
  }
};

export const deleteCustomer = async (id) => {
  try {
    const response = await axios.delete(`${APIURL}/delete`, {
      headers: headers(),
      params: {
        customerID: id,
      },
    });
    return response.data;
  } catch (error) {
    return await errorHandle(error);
  }
};
