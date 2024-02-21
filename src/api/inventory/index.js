import axios from "axios";
import headers from "/util/headers";
import { errorHandle } from "/util/helper";
import { isEmpty } from "/util/helper";

const APIURL = `${process.env.REACT_APP_API_URL}/inventorymanagement`;

export const getInventory = async ({
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
    const response = await axios.get(`${APIURL}/get`, requestOption);
    return response.data;
  } catch (error) {
    return await errorHandle(error);
  }
};

export const getInventoryByID = async (id) => {
  try {
    const response = await axios.get(`${APIURL}/getByID`, {
      headers: headers(),
      params: {
        inventoryID: id,
      },
    });
    return response.data;
  } catch (error) {
    return await errorHandle(error);
  }
};

export const addInventory = async (formData) => {
  try {
    const response = await axios.post(`${APIURL}/add`, formData, {
      headers: headers(),
    });
    return response.data;
  } catch (error) {
    return await errorHandle(error);
  }
};

export const updateInventory = async (formData) => {
  try {
    const response = await axios.patch(`${APIURL}/update`, formData, {
      params: {
        inventoryID: formData.inventoryID,
      },
      headers: headers(),
    });
    return response.data;
  } catch (error) {
    return await errorHandle(error);
  }
};

export const deleteInventory = async (id) => {
  try {
    const response = await axios.delete(`${APIURL}/delete`, {
      headers: headers(),
      params: {
        inventoryID: id,
      },
    });
    return response.data;
  } catch (error) {
    return await errorHandle(error);
  }
};
