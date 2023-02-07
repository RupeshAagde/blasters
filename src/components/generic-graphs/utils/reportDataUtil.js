import {FILTER_VIEW} from "../data/constants";
import cloneDeep from "lodash/cloneDeep";

export function organiseDataForReports(passedData, tabName = Object.keys(passedData)[0], selectedGraphFilter = '') {
    const index = passedData[tabName].graphFilters.findIndex(x => x.id === selectedGraphFilter);
    const graphFilterIndex = index < 0 ? 0 : index;
    const rawData = cloneDeep(passedData);
    const stages = Object.keys(rawData).map(x => ({text: x, value: x, count: 0}));
    const graphFilters = rawData[tabName].graphFilters;
    const timeFilters = rawData[tabName].graphFilters[graphFilterIndex].showTimeFilters ? rawData[tabName].timeFilters : [];
    const reportData = makeAllFiltersForReports(extractReportData(graphFilters, graphFilterIndex));
    return {reportData, stages, graphFilters, timeFilters};
}

export function extractReportData(graphFilterObject, index) {
    return {layoutHeader: graphFilterObject[index].layoutHeader, table: graphFilterObject[index].table};
}

export function makeAllFiltersForReports(reportData) {
    const filterObjectForReports = {
        filterView: FILTER_VIEW.DROP_DOWN
    };
    if (!reportData.layoutHeader) {
        reportData.layoutHeader = {filters: {}};
    }
    reportData.layoutHeader.filters = filterObjectForReports;
    if (!reportData.table) {
        reportData.table = {filters: {}};
    }
    return reportData;
}

export function constructFilterControlFlags(filters, page, defaultFlagState = true) {
    const controlFlags = Object.keys(filters).reduce((a, i) => {
        a[i] = defaultFlagState;
        return a
    }, {});
    return {
        [page]: {...controlFlags, pagination: defaultFlagState}
    }
}