import axios from "axios";
import errorHandler from "./errorHandler";
import headers from "./headers";
import imageCompression from "browser-image-compression";
import { store } from "../redux/store";
import { setUserToken } from "/redux/auth/authSlice";
export function isEmpty(str) {
  if (typeof str == "string" || typeof str == "number") {
    return !str || /^\s*$/.test(str);
  }
  return true;
}

export async function errorHandle(error) {
  if (error.response) {
    const errorRes = error.response.data;
    if (errorRes.code === 401) {
      if (await refreshTokenRequest()) {
        return await requestAgain(error.config);
      } else {
        errorHandler({
          errorCode: errorRes.code,
          errorMessage: errorRes.data,
        });
      }
    } else {
      errorHandler({
        errorCode: errorRes.code,
        errorMessage: errorRes.data,
      });
    }
  } else {
    errorHandler({
      errorCode: error.code ? error.code : 500,
      errorMessage: error.data ? error.data : "Unknown Error",
    });
  }
}

export function getObjectCount(data, level) {
  let count = [];
  level = level || 0;
  count[level] = count[level] || 0;
  for (var k in data) {
    data.hasOwnProperty(k) && count[level]++;
    typeof data[k] === "object" && getObjectCount(data[k], level + 1);
  }
  return count;
}

export function fillKeyInObject(object) {
  let newObject = {};
  for (const key in object) {
    newObject[key] = "";
  }
  return newObject;
}

export const fileToUrl = (input) => {
  return new Promise(async (resolve, reject) => {
    const imageFile = input;

    const options = {
      maxSizeMB: 0.3,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    const compressedFile = await imageCompression(imageFile, options);
    resolve(blobToBase64(compressedFile));
  });
};

export function blobToBase64(blob) {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

export const conditionEmptyฺBody = (body) => {
  let data = {};
  for (const key in body) {
    if (Array.isArray(body[key])) {
      let array = [];
      for (let i = 0; i < body[key].length; i++) {
        array.push(conditionEmptyฺBody(body[key][i]));
      }
      data[key] = array;
    } else if (typeof body[key] === "object") {
      data[key] = conditionEmptyฺBody(body[key]);
    } else {
      if (!isEmpty(body[key])) {
        data[key] = body[key];
      }
    }
  }
  return data;
};

export const conditionButton = (keys, formState, formPlaceHolder) => {
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const firstKey = key.split(".")[0];
    const splitKey = key.split(".");
    splitKey.shift();

    if (splitKey.length >= 1) {
      let stackState = formState[firstKey];
      let placeholderStackState = formPlaceHolder[firstKey];
      for (let speKey of splitKey) {
        if (speKey === firstKey) {
          continue;
        }
        if (typeof stackState[speKey] === "object") {
          stackState = stackState[speKey];
          placeholderStackState = placeholderStackState[speKey];
        } else {
          if (isEmpty(stackState[speKey])) {
            return false;
          }
          if (stackState[speKey] === placeholderStackState[speKey]) {
            return false;
          }
          return true;
        }
      }
    } else {
      if (isEmpty(formState[key])) {
        return false;
      }
      if (formState[key] === formPlaceHolder[key]) {
        return false;
      }
      return true;
    }
  }
};

async function requestAgain(config) {
  const requestOption = {
    headers: headers(),
    params: config.params ? config.params : {},
  };
  try {
    if (config.method === "get") {
      const reqeustConfig = {
        method: config.method,
        url: config.url,
      };
      const response = await axios.get(`${reqeustConfig.url}`, requestOption);
      return response.data;
    } else {
      const reqeustConfig = {
        method: config.method,
        url: config.url,
        data: JSON.parse(config.data),
      };
      const response = await axios[reqeustConfig.method](
        `${reqeustConfig.url}`,
        reqeustConfig.data,
        requestOption
      );
      console.log(response.data);
      return response.data;
    }
  } catch (error) {
    await errorHandle(error);
  }
}

async function refreshTokenRequest() {
  const user = store.getState().auth.user;
  if (user == null) {
    return false;
  } else if (user.refreshToken == null) {
    return false;
  }
  const requestOption = {
    headers: headers(),
  };
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/auth/refreshtoken`,
      {
        refreshToken: user.refreshToken,
      },
      requestOption
    );
    const passToken = {
      accessToken: res.data.data.accessToken,
    };
    await store.dispatch(setUserToken(passToken));
    return true;
  } catch (error) {
    return false;
  }
}

export function randomString(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function PermissionCheck(permission, userPermission) {
  if (userPermission) {
    //check permission include in object
    if (userPermission[permission]) {
      return true;
    }
  }
  return false;
}
