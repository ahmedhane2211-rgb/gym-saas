
import Cookies from "js-cookie"

const deleteToken = () => {
    Cookies.remove("token")
}

export default deleteToken