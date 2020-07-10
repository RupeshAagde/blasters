'use strict';

import URLS from './domain.service';
import ApiService from './api.service';
import { getCommonHeaderOptions } from './utils.service';
import { Object, console } from 'window-or-global';

const UserService = {
    getUserList(params) {
        const axiosOptions = Object.assign(
            { params },
            getCommonHeaderOptions()
        );
        return ApiService.get(URLS.LIST_USERS(), axiosOptions);
    },
    addUser(params) {
        const axiosOptions = Object.assign(
            { data: params },
            getCommonHeaderOptions()
        );
        return ApiService.post(URLS.ADD_USERS(), axiosOptions);
    },
    deleteUser(uid) {
        const axiosOptions = Object.assign(getCommonHeaderOptions());
        return ApiService.del(URLS.DELETE_USERS(uid), axiosOptions);
    },
    searchGrimlockUser(params) {
        const axiosOptions = Object.assign(
            { params },
            getCommonHeaderOptions()
        );
        console.log(axiosOptions, 'axios');
        return ApiService.get(URLS.SEARCH_USER(), axiosOptions);
    }
};
export default UserService;
