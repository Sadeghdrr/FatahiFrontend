import {axiosAgent, CreateNavSide, NotificationModal} from "./utils.js";
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

}

CreateNavSide('profile.html')
InitiateProfile();
addEventListener();
