import errorHandler from "./errorHandler"
export default function headers() {
    const user = JSON.parse(localStorage.getItem('user'))
    const accessToken = user ? user.accessToken : null
    if (accessToken == null) return errorHandler({ errorCode: 500, errorMessage: "Dont Have AccessToken" })
    return {
        "content-type": "application/json",
        "Authorization": accessToken,
        "Accept": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Request-Timeout": "60000"
    }
}