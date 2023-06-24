//import axois
import axios from "axios";
import headers from "util/headers";
import { isEmpty } from "util/helper";
import { errorHandle } from "util/helper";

const APIURL = `${process.env.REACT_APP_API_URL}/projectmanagement/get`;

export const getProjects = async ({ page, pageSize, sortTitle, sortType }) => {
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
    const response = await axios.get(`${APIURL}`, requestOption);
    return response.data;
  } catch (error) {
    return await errorHandle(error);
  }
};
