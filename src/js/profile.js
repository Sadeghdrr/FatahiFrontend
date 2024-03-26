import {axiosAgent, CreateNavSide} from "./utils.js";
import $ from './jquery.module.js';
import './axios.min.js';

function generateFormFields(profileData) {
    const cardBody = $('#profile-card-body');
    cardBody.empty();

    // Iterate over profile data fields
    $.each(profileData, function(field, value) {
        // Create form group div
        const formGroup = $('<div class="form-group"></div>');

        // Create label
        const label = $(`<label for="${field}">${field}</label>`);

        // Create input field
        const input = $(`<input type="text" class="form-control" id="${field}" placeholder="${field} را وارد کنید" value="${value}">`);

        // Append label and input field to form group
        formGroup.append(label, input);

        // Append form group to card body
        cardBody.append(formGroup);
    });
}

CreateNavSide('profile.html')
