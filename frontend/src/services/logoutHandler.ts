import fetchHandler from "./fetchHandler";

const logoutHandler = async () => {
    fetchHandler('logout', 'POST',)
    localStorage.setItem('isLoggedIn', 'false');
}

export default logoutHandler