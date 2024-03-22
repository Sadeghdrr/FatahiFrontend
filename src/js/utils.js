export const SERVER_URL = "http://localhost:8000";

export async function NotificationModal(icon, title, text) {
     await Swal.fire({
        icon: icon,
        title: title,
        text: text,
    });
}

export function CheckHasAuthToken(axiosAgent) {
    if (localStorage.getItem("token")) {
        let data = {
            token: localStorage.getItem("token")
        };

        axiosAgent.post("/login/", data)
            .then((response) => {
                window.location.href = '../../index2.html';
            }, (error) => {
                console.log(error)
                localStorage.removeItem("token")
                window.location.href = './login.html';
            })
    }
}