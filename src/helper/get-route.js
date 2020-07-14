export const getRoute = (route) => {
    const company_route = route.params.company_id
        ? `/company/${route.params.company_id}`
        : '';
    const application_route = route.params.applicationId
        ? `/application/${route.params.applicationId}`
        : '';
    return `${company_route}${application_route}`;
};

export const getCompanyBasePath = (route) => {
    return `/company/${route.params.company_id}`;
};
