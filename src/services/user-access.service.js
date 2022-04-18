'use strict';

import URLS from './domain.service';
import ApiService from './api.service';
import { getCommonHeaderOptions } from './utils.service';

const UserService = {
    getUserList(params, userId) {
        const axiosOptions = Object.assign(
            { params },
            getCommonHeaderOptions()
        );
        return ApiService.get(URLS.LIST_USERS(userId), axiosOptions);
    },
    addUser(params) {
        const axiosOptions = Object.assign(
            { data: params },
            getCommonHeaderOptions()
        );
        return ApiService.post(URLS.ADD_USERS(), axiosOptions);
    },
    adminPermissions() {
        const axiosOptions = Object.assign({}, getCommonHeaderOptions());
        return ApiService.get(URLS.ADMIN_PERMISSIONS(), axiosOptions);
    },
    deleteUser(uid) {
        const axiosOptions = Object.assign(getCommonHeaderOptions());
        return ApiService.del(URLS.DELETE_USERS(uid), axiosOptions);
    },
    updateUser(id, payload) {
        const axiosOptions = Object.assign({}, getCommonHeaderOptions(), {
            data: payload
        });
        return ApiService.put(URLS.DELETE_USERS(id), axiosOptions);
    },
    searchGrimlockUser(params) {
        const axiosOptions = Object.assign(
            { params },
            getCommonHeaderOptions()
        );
        return ApiService.get(URLS.SEARCH_USER(), axiosOptions);
    },
    userSearch(params) {
        const axiosOptions = Object.assign({params}, getCommonHeaderOptions());
        return ApiService.get(URLS.CHECK_USER(), axiosOptions);
    },

};
export default UserService;
