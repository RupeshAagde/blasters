import AuthService from './../../services/auth.service';
import UserAccessService from './../../services/user-access.service';
import {
    UPDATE_USER_DATA,
    FETCH_USER_DATA,
    ON_USER_LOGGED_OUT,
    OPEN_LOGIN_MODAL,
    SIGNOUT_USER,
    VALIDATE_USER,
    FETCH_ADMIN_PERMISSIONS
} from '../action.type';
import {
    SET_USER_DATA,
    SET_USER_LOGGED_IN,
    SET_USER_LOGGED_OUT,
    SET_USER_VALID,
    SET_ADMIN_PERMISSIONS,
    SET_USER_PERMISSIONS
} from '../mutation.type';
import {
    IS_LOGGED_IN,
    GET_USER_INFO,
    IS_VALID_USER,
    ADMIN_PERMISSIONS,
    GET_USER_PERMISSIONS
} from '../getters.type';
import { isBrowser } from 'browser-or-node';
import root, { console } from 'window-or-global';
const env = root.env || {};

const getDefaultState = () => {
    return {
        isLoggedIn: false,
        userData: {},
        userFetched: false,
        isValidUser: false,
        userPermissions: null,
        adminPermissions: null
    };
};

const state = getDefaultState();

const getters = {
    [IS_LOGGED_IN](state) {
        return state.isLoggedIn;
    },
    [GET_USER_INFO](state) {
        return state.userData;
    },
    [IS_VALID_USER](state) {
        return state.isValidUser;
    },
    [GET_USER_PERMISSIONS](state) {
        return state.userPermissions;
    },
    [ADMIN_PERMISSIONS](state) {
        return state.adminPermissions;
    }
};

const mutations = {
    [SET_USER_DATA](state, { data }) {
        state.isLoggedIn = data.isLoggedIn;
        state.userData = data.userData;
        if (data.userFetched) {
            state.userFetched = data.userFetched;
        }
    },
    [SET_USER_LOGGED_IN](state) {
        state.isLoggedIn = true;
    },
    [SET_USER_LOGGED_OUT](state) {
        state.isLoggedIn = false;
        state.isValidUser = false;
        state.userData = {};
        state.userPermissions = null;
    },
    [SET_USER_VALID](state, { data }) {
        state.isValidUser = data.data.staff;
    },
    [SET_USER_PERMISSIONS](state, { data }) {
        state.userPermissions = data.data;
    },
    [SET_ADMIN_PERMISSIONS](state, { data }) {
        state.adminPermissions = data.data;
    }
};

const actions = {
    async [FETCH_USER_DATA]({ commit, dispatch }) {
        try {
            if (this.state.auth.userFetched) {
                return this.state.auth;
            }
            const data = await AuthService.fetchUserData()
            commit(SET_USER_DATA, { data });
            if (data.isLoggedIn){
                commit(SET_USER_LOGGED_IN);
            }
            await dispatch(VALIDATE_USER)
            return data;
        } catch(err) {
            console.log(err)
        }
    },
    async [VALIDATE_USER]({ commit }) {
        try {
            const data = await AuthService.validateUser()
            commit(SET_USER_VALID, { data });
            commit(SET_USER_PERMISSIONS, { data });
            return data;
        } catch(err) {
            console.log(err)
        }
    },
    [UPDATE_USER_DATA]({ commit }, data) {
        commit(SET_USER_DATA, { data });
    },
    [OPEN_LOGIN_MODAL]({ commit }) {
        if (isBrowser) {
            window.location.href = `${env.MIRAGE_MAIN_DOMAIN}/auth/login?redirectUrl=${env.BLASTER_MAIN_DOMAIN}` 
        }
    },
    [ON_USER_LOGGED_OUT]({ commit }) {
        AuthService.onUserLoggedOut();
        commit(SET_USER_LOGGED_OUT);
    },
    [SIGNOUT_USER]({ commit }) {
        AuthService.signOutUser().then(res => {
            //on action of user signout
            AuthService.onUserLoggedOut();
            commit(SET_USER_LOGGED_OUT);
        });
    },
    [FETCH_ADMIN_PERMISSIONS]({ commit }) {
        UserAccessService.adminPermissions().then((data) => {
            commit(SET_ADMIN_PERMISSIONS, { data });
        });
    }
};

export function createAuthStore() {
    return {
        state: getDefaultState(),
        actions,
        mutations,
        getters
    };
}
