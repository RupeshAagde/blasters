import AuthService from './../../services/auth.service';
import {
    UPDATE_USER_DATA,
    FETCH_USER_DATA,
    ON_USER_LOGGED_IN,
    ON_USER_LOGGED_OUT,
    OPEN_LOGIN_MODAL,
    SIGNOUT_USER,
    OPEN_REGISTER_MODAL,
    VALIDATE_USER,
    FETCH_ADMIN_PERMISSIONS
} from '../action.type';
import {
    SET_USER_DATA,
    SET_USER_LOGGED_IN,
    SET_USER_LOGGED_OUT,
    SET_USER_VALID,
    SET_ADMIN_PERMISSIONS
} from '../mutation.type';
import {
    IS_LOGGED_IN,
    GET_USER_INFO,
    IS_VALID_USER,
    ADMIN_PERMISSIONS
} from '../getters.type';

const getDefaultState = () => {
    return {
        isLoggedIn: false,
        userData: {},
        userFetched: false,
        isValidUser: false,
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
    },
    [SET_USER_VALID](state, { data }) {
        state.isValidUser = data.data.staff;
    },
    [SET_ADMIN_PERMISSIONS](state, { data }) {
        state.adminPermissions = data.data.adminPermissions;
    }
};

const actions = {
    [FETCH_USER_DATA]({ commit }) {
        if (this.state.auth.userFetched) {
            return this.state.auth;
        }
        return AuthService.fetchUserData().then((data) => {
            commit(SET_USER_DATA, { data });
            return data;
        });
    },
    [VALIDATE_USER]({ commit }) {
        return AuthService.validateUser().then((data) => {
            commit(SET_USER_VALID, { data });
            return data;
        });
    },
    [UPDATE_USER_DATA]({ commit }, data) {
        commit(SET_USER_DATA, { data });
    },
    [OPEN_LOGIN_MODAL]({ commit }) {
        AuthService.openLoginScreen();
    },
    [OPEN_REGISTER_MODAL]({ commit }) {
        AuthService.openRegisterScreen();
    },
    [ON_USER_LOGGED_IN]({ commit }) {
        AuthService.onUserLoggedIn();
        commit(SET_USER_LOGGED_IN);
    },
    [ON_USER_LOGGED_OUT]({ commit }) {
        AuthService.onUserLoggedOut();
        commit(SET_USER_LOGGED_OUT);
    },
    [SIGNOUT_USER]({ commit }) {
        AuthService.signOutUser().then((res) => {
            //on action of user signout
        });
    },
    [FETCH_ADMIN_PERMISSIONS]({ commit }) {
        AuthService.adminPermissions().then((res) => {
            commit(SET_ADMIN_PERMISSIONS, res);
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
