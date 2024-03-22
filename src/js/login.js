import {SERVER_URL, NotificationModal, CheckHasAuthToken} from "./utils.js";
import $ from './jquery.module.js';
import './axios.min.js';

const axiosAgent = axios.create({
    baseURL: SERVER_URL,
});

CheckHasAuthToken(axiosAgent);

function addEventListeners() {
    let username = $("#username-input")
    let password = $("#password-input")
    let login = $("#login-button")

    login.on("click", function (event) {
        event.preventDefault(); // Prevent the default form submission behavior

        let data = {
            username: username.val(), password: password.val()
        };

        axiosAgent.post("/login/", data)
            .then((response) => {
                localStorage.setItem('token', response.data.token)
                NotificationModal("success", "ورود با موفقیت انجام شد", "لطفا کمی منتظر بمانید...")
                setTimeout(() => {
                    window.location.href = '../../index2.html';
                }, 1000);
            }, (error) => {
                try {
                    if (error.response.status == 400) {
                        NotificationModal("error", "ورود ناموفق", "نام کاربری یا رمز عبور نادرست می باشد")
                    } else {
                        NotificationModal("error", "ورود ناموفق", `status:${error.response.status}`)
                    }
                } catch (error) {
                    NotificationModal("error", "ورود ناموفق")
                }
            })
    });
}

addEventListeners()