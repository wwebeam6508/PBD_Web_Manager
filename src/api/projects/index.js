//import axois
import axios from "axios";
import headers from "/util/headers";
import { isEmpty } from "/util/helper";
import { errorHandle } from "/util/helper";

const APIURL = `${process.env.REACT_APP_API_URL}/projectmanagement`;

export const getProjects = async ({
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

export const getProjectByID = async (id) => {
  try {
    const response = await axios.get(`${APIURL}/getByID`, {
      params: {
        projectID: id,
      },
      headers: headers(),
    });
    return response.data;
  } catch (error) {
    return await errorHandle(error);
  }
};

export const addProject = async (formData) => {
  try {
    const response = await axios.post(`${APIURL}/add`, formData, {
      headers: headers(),
    });
    return response.data;
  } catch (error) {
    return await errorHandle(error);
  }
};

export const updateProject = async (id, formData) => {
  try {
    const response = await axios.post(`${APIURL}/update`, formData, {
      params: {
        projectID: id,
      },
      headers: headers(),
    });
    return response.data;
  } catch (error) {
    return await errorHandle(error);
  }
};

export const deleteProject = async (id) => {
  try {
    const response = await axios.delete(`${APIURL}/delete`, {
      headers: headers(),
      params: {
        projectID: id,
      },
    });
    return response.data;
  } catch (error) {
    return await errorHandle(error);
  }
};

export const getCustomerName = async () => {
  try {
    const response = await axios.get(`${APIURL}/getCustomerName`, {
      headers: headers(),
    });
    return response.data;
  } catch (error) {
    return await errorHandle(error);
  }
};
