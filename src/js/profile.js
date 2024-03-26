import {axiosAgent, CreateNavSide, NotifErrors, NotificationModal} from "./utils.js";
import $ from './jquery.module.js';
import './axios.min.js';

function InitiateProfile() {
    axiosAgent.get('/profile/')
        .then((response) => {
            let profile = response.data
            let insurance_details = profile.insurance_details
            let access_level_data = profile.access_level_data
            delete profile.insurance_details
            delete profile.access_level_data
            delete profile.id
            delete profile.account_state

            // Profile initiation
            $.each(profile, function (field, value) {
                $(`#${field}-input`).val(value)
            })

            // Access_level_data initiation
            $("#access-level").text(`"${access_level_data.access_level}"`)
            $("#branch").text(access_level_data.branch ? `"${access_level_data.branch}"` : "----")
            $("#title").text(access_level_data.title ? `"${access_level_data.title}"` : "----")

            // Insurance initiation
            $.each(insurance_details, function(field, value) {
                if (value == null)
                    $(`#${field}`).text("----")
                else if (value)
                    $(`#${field}`).text('"دارد"')
                else
                    $(`#${field}`).text('"ندارد"')
            })
        })
        .catch((error) => {
            console.error(error)
            NotificationModal("error", "خطا در واکشی پروفایل", `status:${error.response.status}, message:${error.response.data.detail}`)
        })
}

function addEventListener() {
    let password_btn = $("#password-edit-btn")
    let username_btn = $("#username-edit-btn")
    let profile_save_btn = $("#profile-save-btn")
    let profile_edit_btn = $("#profile-edit-btn")

    function toggleEditEnable() {
        if ($(profile_edit_btn).hasClass('btn-success')) {
            $(profile_edit_btn).removeClass('btn-success').addClass('btn-danger').text("انصراف");
        } else {
            $(profile_edit_btn).removeClass('btn-danger').addClass('btn-success').text("ویرایش");
            InitiateProfile()
        }

        $("#profile-card-body input, #profile-save-btn").prop("disabled", function (i, val) {
            return !val;
        });
    }

    profile_edit_btn.click(
        function (event) {
            event.preventDefault(); // Prevent the default form submission behavior
            toggleEditEnable();
        }
    )

    profile_save_btn.click(
        function (event) {
            event.preventDefault()

            let firstName = $("#first_name-input");
            let lastName = $("#last_name-input");
            let nationalId = $("#national_ID-input");
            let email = $("#email-input");
            let mobilePhoneNumber = $("#mobile_phone_number-input");
            let landlinePhoneNumber = $("#landline_phone_number-input");
            let educationalLevel = $("#educational_level-input");
            let major = $("#major-input");
            let bankAccountNumber = $("#bank_account_number-input");
            let postalCode = $("#postal_code-input");
            let address = $("#address-input");

            let data = {
                first_name: firstName.val(),
                last_name: lastName.val(),
                email: email.val(),
                national_ID: nationalId.val(),
                mobile_phone_number: mobilePhoneNumber.val(),
                landline_phone_number: landlinePhoneNumber.val() || "",
                educational_level: educationalLevel.val() || "",
                major: major.val() || "",
                bank_account_number: bankAccountNumber.val(),
                postal_code: postalCode.val() || "",
                address: address.val(),
            };

            axiosAgent.put("/profile/", data)
                .then((response) => {
                    NotificationModal("success", "ویرایش موفق", "ویرایش پروفایل با موفقیت انجام شد")
                    InitiateProfile()
                    toggleEditEnable();
                })
                .catch((error) => {
                    if (error.response && error.response.status === 400) {
                        let errors = error.response.data;
                        let errors_fields = Object.keys(errors);
                        NotifErrors(errors, errors_fields);
                    } else {
                        NotificationModal("error", "ویرایش ناموفق", `status:${error.response ? error.response.status : 'unknown'}`);
                    }
                });

        }
    )
}

CreateNavSide('profile.html')
InitiateProfile();
addEventListener();
