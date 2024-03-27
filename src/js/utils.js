import $ from './jquery.module.js';
import './axios.min.js';

export const SERVER_URL = "http://localhost:8000";

export const axiosAgent = axios.create({
    baseURL: SERVER_URL,
});

// Add a request interceptor
axiosAgent.interceptors.request.use(
    function(config) {
        // Check if token exists in localStorage
        const token = localStorage.getItem('token');
        // If token exists, set authorization header
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    function(error) {
        // Do something with request error
        return Promise.reject(error);
    }
);

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

export function GetCurrentUser() {
    return axiosAgent.get("retrieve/current_user/")
        .then((response) => {
            return response.data; // Return the user's information
        })
        .catch((error) => {
            console.error("Error fetching current user:", error);
            throw error;
        });
}

function getFieldNameInPersian(field_name) {
    const fieldTranslations = {
        first_name: "نام",
        last_name: "نام خانوادگی",
        email: "ایمیل",
        national_ID: "کد ملی",
        mobile_phone_number: "شماره موبایل",
        address: "آدرس",
        bank_account_number: "شماره حساب بانکی",
        landline_phone_number: "تلفن ثابت",
        name: "نام",
        postal_code: "کد پستی",
        major: "رشته تحصیلی",
        educational_level: "آخرین مدرک تحصیلی",
        new_password: "رمز عبور جدید",
        current_password: "رمز عبور فعلی",
    };

    return fieldTranslations[field_name] || field_name;
}

function getErrorInPersian(error_describtion) {
    const errorTranslations = {
        "This field is required.": "این فیلد الزامی است",
        "This field may not be blank.": "این فیلد الزامی است",
        "profile with this email already exists.": "با این ایمیل یک پروفایل دیگر ساخته شده است",
        "profile with this mobile phone number already exists.": "با این شماره همراه یک پروفایل دیگر ساخته شده است",
        "profile with this national ID already exists.": "با این کدملی یک پروفایل دیگر ساخته شده است",
        "profile with this bank account number already exists.": "با این شماره حساب بانکی یک پروفایل دیگر ساخته شده است",
        "Ensure this field has at least 11 characters.": "این فیلد باید حتما 11 کاراکتر داشته باشد",
        "Ensure this field has at least 10 characters.": "این فیلد باید حتما 10 کاراکتر داشته باشد",
        "Enter a valid email address.": "فرمت ایمیل اشتباه است.",
        "This password is too short. It must contain at least 8 characters.": "رمز عبور باید حداقل 8 کاراکتر داشته باشد",
    };

    return errorTranslations[error_describtion] || error_describtion;
}

export async function NotifErrors(errors, errors_fields) {
    console.log(errors)
    console.log(errors_fields)
    for (let i = 0; i < errors_fields.length; i++) {
        for (let error_decribtion of errors[errors_fields[i]])
            await NotificationModal("error", getFieldNameInPersian(errors_fields[i]),
                getErrorInPersian(error_decribtion));
    }
}

function CreateSideBar(user, page_link, sidebar, profile) {
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
   <a href="./${item_link}" class="nav-link ${item_active ? "active" : ""}">
        <i class="fa ${item_icon} nav-icon"></i>
        <p>${item_name}</p>
    </a>
</li>\n`
}

function InitiateNavbar(navbar) {
    let date_time = navbar.find('#date-box').find('#date-time')
    let logout_btn = navbar.find('#logout-button')

    logout_btn.on("click", function (event) {
        axiosAgent.post('/logout/')
            .then((response) => {
                localStorage.removeItem('token')
                NotificationModal("success", "خروج با موفقیت انجام شد", "لطفا کمی منتظر بمانید...")
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1000);
            }, (error) => {
                console.error(error)
                NotificationModal("error", "ورود ناموفق", `status:${error.response.status}, message:${error.response.data.detail}`)

            })
    })

    const currentDate = new persianDate();
    const formattedDate = currentDate.format('YYYY/MM/DD');
    date_time.text(formattedDate);
}

export function CreateNavSide(page_link) {
    CheckHasAuthToken()
        .then((hasAuth) => {
            if (hasAuth) {
                GetCurrentUser()
                    .then((user) => {
                        let sidebar_menu = $("#sidebar-menu")
                        let profile_link = $("#profile-link")
                        let navbar = $("#navbar")
                        CreateSideBar(user, page_link, sidebar_menu, profile_link)
                        InitiateNavbar(navbar)
                    })
            } else
                window.location.href = "login.html"
        })
        .catch((error) => {
            console.error("Error checking authentication:", error);
        });
}