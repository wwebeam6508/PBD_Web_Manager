import axios from 'axios'
import { setAuth, setLogout } from './slice'
import { errorHandle } from '../../../util/helper'
export const login = (username, password) => async (dispatch) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, { username, password })
    localStorage.setItem('user', JSON.stringify(response.data.data))
    dispatch(setAuth(response.data.data))
  } catch (error) {
    errorHandle(error)
  }
}

export const logout = ({ userID }) => async (dispatch) => {
  try {
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, { userID })
    localStorage.removeItem('user')
    dispatch(setLogout())
  } catch (error) {
    errorHandle(error)
  }
}

