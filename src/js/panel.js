import {CheckHasAuthToken, NotificationModal, SERVER_URL} from "./utils.js";
import $ from './jquery.module.js';
import './axios.min.js';

const axiosAgent = axios.create({
    baseURL: SERVER_URL,
});

CheckHasAuthToken(axiosAgent);
