import axios from "axios";
import headers from "/util/headers";
import { isEmpty } from "/util/helper";
import { errorHandle } from "/util/helper";

const APIURL = `${process.env.REACT_APP_API_URL}/expensemanagement`;

export const getExpenses = async ({
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
    return response.data.data;
  } catch (error) {
    return await errorHandle(error);
  }
};

export const getExpenseByID = async (id) => {
  try {
    const response = await axios.get(`${APIURL}/getByID`, {
      headers: headers(),
      params: {
        expenseID: id,
      },
    });
    return response.data;
  } catch (error) {
    return await errorHandle(error);
  }
};

export const addExpense = async (formData) => {
  try {
    const response = await axios.post(`${APIURL}/add`, formData, {
      headers: headers(),
    });
    return response.data;
  } catch (error) {
    return await errorHandle(error);
  }
};

export const updateExpense = async (id, formData) => {
  try {
    //query
    const response = await axios.post(`${APIURL}/update`, formData, {
      params: {
        expenseID: id,
      },
      headers: headers(),
    });
    return response.data;
  } catch (error) {
    return await errorHandle(error);
  }
};

export const deleteExpense = async (id) => {
  try {
    const response = await axios.delete(`${APIURL}/delete`, {
      headers: headers(),
      params: {
        expenseID: id,
      },
    });
    return response.data;
  } catch (error) {
    return await errorHandle(error);
  }
};

export const getProjectTitle = async () => {
  try {
    const response = await axios.get(`${APIURL}/getProjectTitle`, {
      headers: headers(),
    });
    return response.data;
  } catch (error) {
    return await errorHandle(error);
  }
};

export const getSellerName = async () => {
  try {
    const response = await axios.get(`${APIURL}/getSellerName`, {
      headers: headers(),
    });
    return response.data;
  } catch (error) {
    return await errorHandle(error);
  }
};
