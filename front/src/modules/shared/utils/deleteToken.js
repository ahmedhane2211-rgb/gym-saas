
import Cookies from "js-cookie"

const deleteToken = () => {
    Cookies.remove("token")
    window.location.href = "/login"
}


export default deleteToken