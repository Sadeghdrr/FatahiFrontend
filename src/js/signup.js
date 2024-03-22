import {CheckHasAuthToken, NotificationModal, SERVER_URL} from "./utils.js";
import $ from './jquery.module.js';
import './axios.min.js';

const axiosAgent = axios.create({
    baseURL: SERVER_URL,
});

CheckHasAuthToken(axiosAgent);

function getFieldNameInPersian(field_name) {
    const fieldTranslations = {
        first_name: "نام",
        last_name: "نام خانوادگی",
        email: "ایمیل",
        national_ID: "کد ملی",
        mobile_phone_number: "شماره موبایل",
        address: "آدرس",
        bank_account_number: "شماره حساب بانکی",
        error: "پروفایل تکراری",
        landline_phone_number: "تلفن ثابت",
        postal_code: "کد پستی",
        major: "رشته تحصیلی",
        educational_level: "آخرین مدرک تحصیلی",
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
    };

    return errorTranslations[error_describtion] || error_describtion;
}

async function NotifErrors(errors, errors_fields) {
    for (let i = 0; i < errors_fields.length; i++) {
        for (let error_decribtion of errors[errors_fields[i]])
            await NotificationModal("error", getFieldNameInPersian(errors_fields[i]),
                getErrorInPersian(error_decribtion));
    }
}

function addEventListeners() {
    let firstName = $("#first-name-input");
    let lastName = $("#last-name-input");
    let nationalId = $("#national-id-input");
    let email = $("#email-input");
    let mobilePhoneNumber = $("#mobile-phone-number-input");
    let landlinePhoneNumber = $("#landline-phone-number-input");
    let educationalLevel = $("#educational-level-input");
    let major = $("#major-input");
    let bankAccountNumber = $("#bank-account-number-input");
    let postalCode = $("#postal-code-input");
    let address = $("#address-input");
    let signupButton = $("#signup-button");

    signupButton.on("click", function (event) {
        event.preventDefault(); // Prevent the default form submission behavior

        let data = {
            first_name: firstName.val(),
            last_name: lastName.val(),
            email: email.val(),
            national_ID: nationalId.val(),
            mobile_phone_number: mobilePhoneNumber.val(),
            landline_phone_number: landlinePhoneNumber.val() || "", // Set empty string for optional field
            educational_level: educationalLevel.val() || "",
            major: major.val() || "",
            bank_account_number: bankAccountNumber.val(),
            postal_code: postalCode.val() || "",
            address: address.val(),
        };


        axiosAgent.post("/signup/", data)
            .then((response) => {
                NotificationModal("success", "ثبت نام با موفقیت انجام شد", "نام کاربری و رمز عبور برای شما پیامک خواهد شد")
            }, (error) => {
                // TODO: delete debuging logs
                console.log(error)
                try {
                    if (error.response.status == 400) {
                        let errors = error.response.data;
                        let errors_fields = Object.keys(errors);
                        // TODO: delete debuging logs
                        console.log(errors)
                        console.log(errors_fields)
                        console.log(errors_fields.length)
                        console.log(data)
                        NotifErrors(errors, errors_fields);
                    } else {
                        NotificationModal("error", "ثبت نام ناموفق", `status:${error.response.status}`)
                    }
                } catch (error) {
                    NotificationModal("error", "ثبت نام ناموفق")
                }
            })
    });

    let cornerButton = $("#corner-button");
    cornerButton.on("click", function () {
        window.location.href = "./login.html";
    });
}

addEventListeners();
