import { isBrowser, isNode } from 'browser-or-node';
import { FETCH_USER_DATA, VALIDATE_USER } from '../../store/action.type';

export function authenticatedUser(to, from, next) {
    if (isNode) {
        return next();
    }
    import('./../../entry-client').then((appModule) => {
        const appStore = appModule.getAppStore();
        window.loadGrimlock
            .then(() => {
                return appStore.dispatch(FETCH_USER_DATA);
            })
            .then((data) => {
                if (data.isLoggedIn) {
                    next();
                    return;
                }
                next('/');
            })
            .catch(() => {
                next('/');
            });
    });
}

export function resolveGrimlock(to, from, next) {
    if (isNode) {
        return next();
    }
    import('./../../entry-client').then((appModule) => {
        const appStore = appModule.getAppStore();

        window.loadGrimlock
            .then(() => {
                return appStore.dispatch(FETCH_USER_DATA);
            })
            .then((data) => {
                return next();
            })
            .catch(() => {
                return next();
            });
    });
}

export const checkUserPermission = (
    to,
    from,
    next,
    permissions = [],
    companyIdKey = ''
) => {
    if (isNode) {
        return next();
    }
    import('./../../entry-client').then((appModule) => {
        const appStore = appModule.getAppStore();
        let userPermissions = appStore.state.auth.userPermissions;

        let promise = Promise.resolve(userPermissions);
        if (!userPermissions) {
            promise = appStore.dispatch(VALIDATE_USER);
        }

        return promise
            .then(() => {
                userPermissions = appStore.state.auth.userPermissions;
                const companyAccess = userPermissions.access;
                let company_id = null;
                if (companyIdKey) {
                    const { params } = to;
                    company_id = parseInt(params[companyIdKey]);
                }
                // Admin permissions Auth Guard
                if (
                    permissions.length &&
                    userPermissions.permissions.includes(
                        permissions.toString()
                    ) &&
                    (!company_id ||
                        companyAccess.all ||
                        companyAccess.company.includes(company_id))
                ) {
                    next();
                    return;
                } else {
                    next(`/`);
                }
            })
            .catch(() => {
                next(`/`);
            });
    });
};
