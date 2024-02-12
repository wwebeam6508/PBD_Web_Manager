import axios from "axios";
import headers from "/util/headers";
import { errorHandle } from "/util/helper";
import { isEmpty } from "/util/helper";

const APIURL = `${process.env.REACT_APP_API_URL}/usermanagement`;

export const getUser = async ({
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
    const response = await axios.get(`${APIURL}/getUser`, requestOption);
    return response.data;
  } catch (error) {
    return await errorHandle(error);
  }
};

export const getUserByID = async (id) => {
  try {
    const response = await axios.get(`${APIURL}/getUserByID`, {
      headers: headers(),
      params: {
        userID: id,
      },
    });
    return response.data;
  } catch (error) {
    return await errorHandle(error);
  }
};

export const addUser = async (formData) => {
  try {
    const response = await axios.post(`${APIURL}/addUser`, formData, {
      headers: headers(),
    });
    return response.data;
  } catch (error) {
    return await errorHandle(error);
  }
};

export const updateUser = async (id, formData) => {
  try {
    const response = await axios.post(`${APIURL}/updateUser`, formData, {
      params: {
        userID: id,
      },
      headers: headers(),
    });
    return response.data;
  } catch (error) {
    return await errorHandle(error);
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`${APIURL}/deleteUser`, {
      headers: headers(),
      params: {
        userID: id,
      },
    });
    return response.data;
  } catch (error) {
    return await errorHandle(error);
  }
};

export const getUserType = async () => {
  try {
    const response = await axios.get(`${APIURL}/getUserTypeName`, {
      headers: headers(),
    });
    return response.data;
  } catch (error) {
    return await errorHandle(error);
  }
};
