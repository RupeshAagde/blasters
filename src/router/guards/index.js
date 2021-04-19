import { isBrowser, isNode } from 'browser-or-node';
import { FETCH_USER_DATA, VALIDATE_USER } from '../../store/action.type';
import { getNavigations } from '../../pages/administrator/navigations';

export function authenticatedUser(to, from, next) {
    if (isNode) {
        return next();
    }
    import('./../../entry-client').then((appModule) => {
        const appStore = appModule.getAppStore();
        return appStore.dispatch(FETCH_USER_DATA)
            .then((data) => {
                if (data.isLoggedIn) {
                    if (to.fullPath !== '/administrator') {
                        next();
                        return;
                    }
                    let userPermissions = appStore.state.auth.userPermissions;
                    let promise = Promise.resolve(userPermissions);
                    if (!userPermissions) {
                        promise = appStore.dispatch(VALIDATE_USER);
                    }
                    return promise
                        .then(() => {
                            const currentPermissions =
                                appStore.state.auth.userPermissions.permissions;
                            let firstRoute = getNavigations().find((navItem) =>
                                currentPermissions.includes(navItem.permission)
                            );
                            let redirectLink = firstRoute
                                ? firstRoute.link
                                : '/';
                            // to avoid infinite loop
                            if (to.fullPath !== redirectLink) {
                                next(redirectLink);
                            } else {
                                next();
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                            next('/');
                        });
                }
                next('/');
            })
            .catch(() => {
                next('/');
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
