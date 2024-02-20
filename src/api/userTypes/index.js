import axios from "axios";
import headers from "/util/headers";
import { errorHandle } from "/util/helper";
import { isEmpty } from "/util/helper";

const APIURL = `${process.env.REACT_APP_API_URL}/usertypemanagement`;

export const getUserType = async ({
  page,
  pageSize,
  sortTitle,
  sortType,
  search,
  searchFilter,
}) => {
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
  if (!isEmpty(search) && !isEmpty(searchFilter)) {
    requestOption.params.search = search;
    requestOption.params.searchFilter = searchFilter;
  }
  try {
    const response = await axios.get(`${APIURL}/getUserType`, requestOption);
    return response.data;
  } catch (error) {
    return await errorHandle(error);
  }
};

export const getUserTypeByID = async (id) => {
  try {
    const response = await axios.get(`${APIURL}/getUserTypeByID`, {
      headers: headers(),
      params: {
        userTypeID: id,
      },
    });
    return response.data;
  } catch (error) {
    return await errorHandle(error);
  }
};

export const addUserType = async (formData) => {
  try {
    const response = await axios.post(`${APIURL}/addUserType`, formData, {
      headers: headers(),
    });
    return response.data;
  } catch (error) {
    return await errorHandle(error);
  }
};

export const updateUserType = async (formData) => {
  try {
    const response = await axios.post(`${APIURL}/updateUserType`, formData, {
      params: {
        userTypeID: formData.userTypeID,
      },
      headers: headers(),
    });
    return response.data;
  } catch (error) {
    return await errorHandle(error);
  }
};

export const deleteUserType = async (id) => {
  try {
    const response = await axios.delete(`${APIURL}/deleteUserType`, {
      headers: headers(),
      params: {
        userTypeID: id,
      },
    });
    return response.data;
  } catch (error) {
    return await errorHandle(error);
  }
};
