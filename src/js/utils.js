export const SERVER_URL = "http://localhost:8000";

export async function NotificationModal(icon, title, text) {
    await Swal.fire({
        icon: icon,
        title: title,
        text: text,
    });
}

export function CheckHasAuthToken(axiosAgent) {
    return new Promise((resolve, reject) => {
        if (localStorage.getItem("token")) {
            let data = {
                token: localStorage.getItem("token")
            };

            axiosAgent.post("/login/", data)
                .then((response) => {
                    resolve(true);
                })
                .catch((error) => {
                    localStorage.removeItem("token");
                    resolve(false);
                });
        } else {
            resolve(false);
        }
    });
}

export function CreateSideBar(access_level, page_link) {
    let result = "";
    switch (access_level) {
        case 'کاربر':
            result += CreateSidebarItem("contracts.html", "قراردادهای من", "fa-address-book", page_link === "contracts.html");
            result += CreateSidebarItem("reports.html", "گزارش ها", "fa-solid fa-file-contract", page_link === "reports.html");
            result += CreateSidebarItem("salary.html", "فیش حقوقی", "fa-solid fa-receipt", page_link === "salary.html");
            break;
        case 'مسئول واحد':
            result += CreateSidebarItem("contracts.html", "قراردادها", "fa-address-book", page_link === "contracts.html");
            result += CreateSidebarItem("new_contract.html", "درخواست قرارداد جدید", "fa-solid fa-plus", page_link === "new_contract.html");
            result += CreateSidebarItem("reports.html", "گزارش ها", "fa-solid fa-file-contract", page_link === "reports.html");
            result += CreateSidebarItem("budget.html", "بودجه", "fa-solid fa-coins", page_link === "budget.html");
            break;
        case 'معاونت سرفصل':
            result += CreateSidebarItem("contracts.html", "قراردادها", "fa-address-book", page_link === "contracts.html");
            result += CreateSidebarItem("reports.html", "گزارش ها", "fa-solid fa-file-contract", page_link === "reports.html");
            result += CreateSidebarItem("budget.html", "بودجه", "fa-solid fa-coins", page_link === "budget.html");
            break;
        case 'مسئول قرارداد ها':
            result += CreateSidebarItem("contracts.html", "قراردادها", "fa-address-book", page_link === "contracts.html");
            result += CreateSidebarItem("new_contract.html", "ساخت قرارداد جدید", "fa-solid fa-plus", page_link === "new_contract.html");
            result += CreateSidebarItem("reports.html", "گزارش ها", "fa-solid fa-file-contract", page_link === "reports.html");
            result += CreateSidebarItem("budget.html", "بودجه", "fa-solid fa-coins", page_link === "budget.html");
            result += CreateSidebarItem("users.html", "کاربران", "fa-users", page_link === "users.html");
            result += CreateSidebarItem("items.html", "آیتم های قرارداد", "fa-list-alt", page_link === "items.html");
            break;
        case 'مسئول تاریخ شفاهی':
            result += CreateSidebarItem("contracts.html", "قراردادها", "fa-address-book", page_link === "contracts.html");
            result += CreateSidebarItem("reports.html", "گزارش ها", "fa-solid fa-file-contract", page_link === "reports.html");
            result += CreateSidebarItem("budget.html", "بودجه", "fa-solid fa-coins", page_link === "budget.html");
            result += CreateSidebarItem("items.html", "آیتم های قرارداد", "fa-list-alt", page_link === "items.html");
            break;
        default:
        // Statements executed when none of the cases match the expression
    }

    return result;
}

function CreateSidebarItem(item_link, item_name, item_icon, item_active) {
    return `<li class="nav-item">
   <a href="${item_link}" class="nav-link ${item_active ? "active" : ""}">
        <i class="fa ${item_icon} nav-icon"></i>
        <p>${item_name}</p>
    </a>
</li>\n`
}

export function GetCurrentUser(axiosAgent) {
    return axiosAgent.get("retrieve/current_user/")
        .then((response) => {
            console.log(response)
            return response.data; // Return the user's information
        })
        .catch((error) => {
            console.error("Error fetching current user:", error);
            throw error;
        });
}