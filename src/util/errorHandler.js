
import Swal from "sweetalert2";
import { store } from "../redux/store";
import { logout } from "../redux/auth/authAction";
import withReactContent from "sweetalert2-react-content";
import { Router } from "react-router-dom";
const MySwal = withReactContent(Swal)

const Error = ({ errorCode, errorMessage }) => {
    switch (errorCode) {
        case 400:
            errorShow('Bad Request', errorMessage)
            break;
        case 401:
            errorShow('Access denied', errorMessage)
            break;
        case 403:
            errorShow('Forbidden', errorMessage)
            break;
        case 404:
            errorShow('Not Found', errorMessage)
            break;
        case 405:
            errorShow('Method Not Allowed', errorMessage)
            break;
        case 406:
            errorShow('Not Acceptable', errorMessage)
            break;
        case 408:
            errorShow('Request Timeout', errorMessage)
            break;
        case 409:
            errorShow('Conflict', errorMessage)
            break;
        case 410:
            errorShow('Gone', errorMessage)
            break;
        case 411:
            errorShow('Length Required', errorMessage)
            break;
        case 412:
            errorShow('Precondition Failed', errorMessage)
            break;
        case 413:
            errorShow('Payload Too Large', errorMessage)
            break;
        case 414:
            errorShow('URI Too Long', errorMessage)
            break;
        case 415:
            errorShow('Unsupported Media Type', errorMessage)
            break;
        case 416:
            errorShow('Range Not Satisfiable', errorMessage)
            break;
        case 417:
            errorShow('Expectation Failed', errorMessage)
            break;
        case 418:
            errorShow('I\'m a teapot', errorMessage)
            break;
        case 421:
            errorShow('Misdirected Request', errorMessage)
            break;
        case 422:
            errorShow('Unprocessable Entity', errorMessage)
            break;
        case 423:
            errorShow('Locked', errorMessage)
            break;
        case 424:
            errorShow('Failed Dependency', errorMessage)
            break;
        case 425:
            errorShow('Too Early', errorMessage)
            break;
        case 426:
            errorShow('Upgrade Required', errorMessage)
            break;
        case 428:
            errorShow('Precondition Required', errorMessage)
            break;
        case 429:
            errorShow('Too Many Requests', errorMessage)
            break;
        case 431:
            errorShow('Request Header Fields Too Large', errorMessage)
            break;
        case 451:
            errorShow('Unavailable For Legal Reasons', errorMessage)
            break;
        case 500:
            errorShow('Internal Server Error', errorMessage)
            break;
        case 501:
            errorShow('Not Implemented', errorMessage)
            break;
        case 502:
            errorShow('Bad Gateway', errorMessage)
            break;
        case 503:
            errorShow('Service Unavailable', errorMessage)
            break;
        case 504:
            errorShow('Gateway Timeout', errorMessage)
            break;
        case 505:
            errorShow('HTTP Version Not Supported', errorMessage)
            break;
        case 506:
            errorShow('Variant Also Negotiates', errorMessage)
            break;
        case 507:
            errorShow('Insufficient Storage', errorMessage)
            break;
        case 508:
            errorShow('Loop Detected', errorMessage)
            break;
        case 510:
            errorShow('Not Extended', errorMessage)
            break;
        case 511:
            errorShow('Network Authentication Required', errorMessage)
            break
        default:
            errorShow(500, errorMessage ? errorMessage : 'เกิดข้อผิดพลาดบางอย่าง')
            break;
    }
};

function errorShow(errorCode, errorMessage) {
    ifAccessDenial(errorCode)
    MySwal.fire({
        icon: 'error',
        title: errorCode,
        text: errorMessage
    })
}

function ifAccessDenial(errorCode) {
    const state = store.getState()
    if (errorCode === `Access denied`) {
        if (state.auth.isAuthenticated === false) return
        else {
            const userID = state.auth.user.userProfile.userID
            store.dispatch(logout({ userID: userID }))
            Router.replace('/admin/login')
        }
    }
}

export default Error;