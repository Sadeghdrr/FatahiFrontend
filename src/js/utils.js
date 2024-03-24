import $ from './jquery.module.js';
import './axios.min.js';

export const SERVER_URL = "http://localhost:8000";

export const axiosAgent = axios.create({
    baseURL: SERVER_URL,
});

export async function NotificationModal(icon, title, text) {
    await Swal.fire({
        icon: icon,
        title: title,
        text: text,
    });
}

export function CheckHasAuthToken() {
    return new Promise((resolve, reject) => {
        if (localStorage.getItem("token")) {
            let data = {
                token: localStorage.getItem("token")
            };

            axiosAgent.post("/login/", data)
                .then((response) => {
                    axiosAgent.defaults.headers.common['Authorization'] = `Bearer ${localStorage.token}`;
                    resolve(true);
                })
                .catch((error) => {
                    localStorage.removeItem("token");
                    axiosAgent.defaults.headers.common['Authorization'] = '';
                    resolve(false);
                });
        } else {
            resolve(false);
        }
    });
}

export function GetCurrentUser() {
    return axiosAgent.get("retrieve/current_user/")
        .then((response) => {
            // TODO: debugging log
            console.log(response)
            return response.data; // Return the user's information
        })
        .catch((error) => {
            console.error("Error fetching current user:", error);
            throw error;
        });
}

export function CreateSideBar(user, page_link, sidebar, profile) {
    let html_body = "";
    switch (user.access_level) {
        case 'کاربر':
            html_body += CreateSidebarItem("contracts.html", "قراردادهای من", "fa-address-book", page_link === "contracts.html");
            html_body += CreateSidebarItem("reports.html", "گزارش ها", "fa-solid fa-file-contract", page_link === "reports.html");
            html_body += CreateSidebarItem("salary.html", "فیش حقوقی", "fa-solid fa-receipt", page_link === "salary.html");
            break;
        case 'مسئول واحد':
            html_body += CreateSidebarItem("contracts.html", "قراردادها", "fa-address-book", page_link === "contracts.html");
            html_body += CreateSidebarItem("new_contract.html", "درخواست قرارداد جدید", "fa-solid fa-plus", page_link === "new_contract.html");
            html_body += CreateSidebarItem("reports.html", "گزارش ها", "fa-solid fa-file-contract", page_link === "reports.html");
            html_body += CreateSidebarItem("budget.html", "بودجه", "fa-solid fa-coins", page_link === "budget.html");
            break;
        case 'معاونت سرفصل':
            html_body += CreateSidebarItem("contracts.html", "قراردادها", "fa-address-book", page_link === "contracts.html");
            html_body += CreateSidebarItem("reports.html", "گزارش ها", "fa-solid fa-file-contract", page_link === "reports.html");
            html_body += CreateSidebarItem("budget.html", "بودجه", "fa-solid fa-coins", page_link === "budget.html");
            break;
        case 'مسئول قرارداد ها':
            html_body += CreateSidebarItem("contracts.html", "قراردادها", "fa-address-book", page_link === "contracts.html");
            html_body += CreateSidebarItem("new_contract.html", "ساخت قرارداد جدید", "fa-solid fa-plus", page_link === "new_contract.html");
            html_body += CreateSidebarItem("reports.html", "گزارش ها", "fa-solid fa-file-contract", page_link === "reports.html");
            html_body += CreateSidebarItem("budget.html", "بودجه", "fa-solid fa-coins", page_link === "budget.html");
            html_body += CreateSidebarItem("users.html", "کاربران", "fa-users", page_link === "users.html");
            html_body += CreateSidebarItem("items.html", "آیتم های قرارداد", "fa-list-alt", page_link === "items.html");
            break;
        case 'مسئول تاریخ شفاهی':
            html_body += CreateSidebarItem("contracts.html", "قراردادها", "fa-address-book", page_link === "contracts.html");
            html_body += CreateSidebarItem("reports.html", "گزارش ها", "fa-solid fa-file-contract", page_link === "reports.html");
            html_body += CreateSidebarItem("budget.html", "بودجه", "fa-solid fa-coins", page_link === "budget.html");
            html_body += CreateSidebarItem("items.html", "آیتم های قرارداد", "fa-list-alt", page_link === "items.html");
            break;
        default:
        // Statements executed when none of the cases match the expression
    }

    sidebar.html(html_body)
    profile.text(user.name.split('-')[1] + ' ' + user.name.split('-')[0])
}

function CreateSidebarItem(item_link, item_name, item_icon, item_active) {
    return `<li class="nav-item">
   <a href="${item_link}" class="nav-link ${item_active ? "active" : ""}">
        <i class="fa ${item_icon} nav-icon"></i>
        <p>${item_name}</p>
    </a>
</li>\n`
}

export function InitiateNavbar(navbar) {
    let date_time = navbar.find('#date-box').find('#date-time')
    let logout_btn = navbar.find('#logout-button')

    logout_btn.on("click", function (event) {
        axiosAgent.post('/logout/')
            .then((response) => {
                // TODO: debugging log
                console.log(response)
                localStorage.removeItem('token')
                NotificationModal("success", "خروج با موفقیت انجام شد", "لطفا کمی منتظر بمانید...")
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1000);
            }, (error) => {
                // TODO: debugging log
                console.error(error)
                NotificationModal("error", "ورود ناموفق", error.response.status)
            })
    })

    const currentDate = new persianDate();
    const formattedDate = currentDate.format('YYYY/MM/DD');
    date_time.text(formattedDate);
}