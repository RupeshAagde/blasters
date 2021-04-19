import { LocalStorageService } from './localstorage.service';
import { isBrowser, isNode } from 'browser-or-node';
import URLS from './domain.service';
import ApiService from './api.service';
import { getCommonHeaderOptions } from '../services/utils.service';

const AuthService = {
    fetchUserData() {
        return ApiService.get(URLS.USER_PROFILE(), {}).then(({ data }) => {
            return {
                isLoggedIn: true,
                userData: data,
                userFetched: true
            }
        }).catch(err => {
            return {
                isLoggedIn: false,
                userFetched: true
            }
        });
    },
    validateUser(params) {
        const axiosOptions = Object.assign(
            {},
            { params: params },
            getCommonHeaderOptions(),
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-currency-code': 'INR'
                }
            }
        );
        return ApiService.get(URLS.VALIDATE_USER(), axiosOptions);
    },
    onUserLoggedOut() {
        //Handle logged out
        //Clear localstorage data here.

        if (isBrowser) {
            LocalStorageService.removeAll();
            window.location.href = '/';
        }
        return;
    },
    signOutUser() {
        return ApiService.get(URLS.USER_LOGOUT(), {})
        .then(({data}) => {
            return data;
        })
        .catch(err => {
            return { error: true, msg: err };
        })
    }
};
export default AuthService;
