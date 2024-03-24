import {axiosAgent, CheckHasAuthToken, CreateSideBar, GetCurrentUser, InitiateNavbar, SERVER_URL} from "./utils.js";
import $ from './jquery.module.js';
import './axios.min.js';

CheckHasAuthToken()
    .then((hasAuth) => {
        if (hasAuth) {
            GetCurrentUser()
                .then((user) => {
                    let sidebar_menu = $("#sidebar-menu")
                    let profile_link = $("#profile-link")
                    CreateSideBar(user, "contracts.html", sidebar_menu, profile_link)
                })
        } else
            window.location.href = "login.html"
    })
    .catch((error) => {
        console.error("Error checking authentication:", error);
    });

InitiateNavbar($("#navbar"))

