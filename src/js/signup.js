import {
    axiosAgent,
    CheckHasAuthToken,
    NotifErrors,
    NotificationModal
} from "./utils.js";
import $ from './jquery.module.js';
import './axios.min.js';

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
            })
            .catch((error) => {
            try {
                if (error.response.status == 400) {
                    let errors = error.response.data;
                    let errors_fields = Object.keys(errors);
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
        window.location.href = "login.html";
    });
}

CheckHasAuthToken()
    .then((hasAuth) => {
        if (hasAuth)
            window.location.href = "contracts.html"
        else
            addEventListeners();
    })
    .catch((error) => {
        console.error("Error checking authentication:", error);
    });
