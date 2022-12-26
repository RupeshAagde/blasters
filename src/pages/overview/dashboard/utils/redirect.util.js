import path from "path";
const getRedirectionUrl = (basePath, navLink, route) => {
    if (basePath.match('application')) {
        return path.join(basePath, navLink)
    }
    return path.join(basePath, 'marketplace', route.params.marketplaceName, navLink)
}

export {getRedirectionUrl}