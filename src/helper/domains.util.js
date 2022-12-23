export const getPrimaryDomain = domains => {
    const domain = domains.find(d => d.is_primary);
    if (domain) {
        return domain.name;
    } else {
        return null;
    }
};

export const getShortlinkDomain = domains => {
    const domain = domains.find(d => d.is_shortlink);
    if (domain) {
        return domain.name;
    } else {
        return null;
    }
};
