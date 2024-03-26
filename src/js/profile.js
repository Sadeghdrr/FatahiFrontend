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

    async function change_password() {
        const password_changer_modal = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success m-3 p-2",
                cancelButton: "btn btn-danger m-3 p-2"
            },
            buttonsStyling: false
        });

        await password_changer_modal.fire({
            title: "تغییر رمز عبور",
            html: `
            <label for="current-password">رمز عبور فعلی</label>
            <input type="password" id="current-password" class="swal2-input mt-0 mb-4 ltr">
            <label for="new-password">رمز عبور جدید</label>
            <input type="password" id="new-password" class="swal2-input mt-0 mb-4 ltr">
            <label for="new-password-again">تکرار رمز عبور جدید</label>
            <input type="password" id="new-password-again" class="swal2-input mt-0 mb-4 ltr">
            <div id="no-match-error" class="text-center d-block" style="color: red"></div>`,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: "تغییر رمز",
            cancelButtonText: "انصراف",
            inputAttributes: {
                autocapitalize: "off"
            },
            preConfirm: () => {
                const currentPassword = $("#current-password").val();
                const newPassword = $("#new-password").val();
                const newPasswordAgain = $("#new-password-again").val();

                if (newPassword !== newPasswordAgain) {
                    $("#no-match-error").text("رمز عبور جدید و تکرار آن مطابقت ندارند")
                    return false; // Prevent the modal from closing
                }

                return [currentPassword, newPassword];
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const [currentPassword, newPassword] = result.value;

                axiosAgent.put("/profile/change_password/", {
                    "current_password": currentPassword,
                    "new_password": newPassword
                }).then((response) => {
                    NotificationModal("success", "ویرایش موفق", "رمز عبور با موفقیت تغییر یافت")
                }).catch((error) => {
                    if (error.response && error.response.status === 400) {
                        let errors = error.response.data;
                        let errors_fields = Object.keys(errors);
                        NotifErrors(errors, errors_fields);
                    } else {
                        NotificationModal("error", "ویرایش ناموفق", `status:${error.response ? error.response.status : 'unknown'}`);
                    }
                });
            }
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

    password_btn.click(function (event) {
       change_password()
    })

    username_btn.click(
        function (event) {
            Swal.fire({
                title: "نام کاربری جدید:",
                html: `
                <input type="text" id="new-username" class="swal2-input mt-0 mb-4 ltr">
                <div class="d-block text-center" id="username-length-error" style="color: red"></div>
                `,
                inputAttributes: {
                    autocapitalize: "off"
                },
                showDenyButton: true,
                confirmButtonText: "تایید",
                denyButtonText: "انصراف",
                preConfirm: function () {
                    let username = $("#new-username").val()
                    if (username.length <= 5) {
                        $("#username-length-error").text("طول نام کاربری باید بیشتر از 5 کاراکتر باشد")
                        return false
                    }
                    return username;
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    axiosAgent.put("/profile/change_username/", {"new_username": result.value})
                        .then((response) => {
                            NotificationModal("success", "ویرایش موفق", `نام کاربری با موفقیت به "${result.value}" تغییر یافت`)
                        }).catch((error) => {
                            if (error.response && error.response.status === 400) {
                                let errors = error.response.data;
                                let errors_fields = Object.keys(errors);
                                NotifErrors(errors, errors_fields);
                            } else {
                                NotificationModal("error", "ویرایش ناموفق", `status:${error.response ? error.response.status : 'unknown'}`);
                            }
                        });
                }
            })
        }
    )
}

CreateNavSide('profile.html')
InitiateProfile();
addEventListener();
