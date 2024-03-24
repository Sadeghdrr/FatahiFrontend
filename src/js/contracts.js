import {CheckHasAuthToken, CreateSideBar, GetCurrentUser, SERVER_URL} from "./utils.js";
import $ from './jquery.module.js';
import './axios.min.js';

const axiosAgent = axios.create({
    baseURL: SERVER_URL,
});

CheckHasAuthToken(axiosAgent)
    .then((hasAuth) => {
        if (hasAuth) {
            axiosAgent.defaults.headers.common['Authorization'] = `Bearer ${localStorage.token}`;
            GetCurrentUser(axiosAgent).then((user) => {
                console.log(user)
                $("#sidebar-menu").html(CreateSideBar(user.access_level, "contracts.html"));
            })
        }
        else
            window.location.href = "login.html"
    })
    .catch((error) => {
        console.error("Error checking authentication:", error);
    });
