import {
    ADMIN_SET_DASHBOARD_DATA,
    ADMIN_SET_NINJA_DASHBOARD_DATA,
    LAYOUT_FOR_EXTRA_LARGER_DEVICE,
    LAYOUT_FOR_LARGER_DEVICE,
    LAYOUT_FOR_MOBILE_DEVICE,
    SAVE_ALL_FILTERS,
    SAVE_COMPONENT_SPECIFIC_FILTERS,
    SET_IS_DEFAULT_LAYOUT,
    SET_NAV_LINK,
    SET_SEED_FILTERS
} from "../store/mutation.type";
import {ANALYTICS_PAGES} from "../components/generic-graphs/data/constants";
import {FILTER_TYPES, SALES_CHANNEL_TYPE} from "../store/modules/admin-analytics.module";
import {getPrimaryDomain} from "./domains.util";
import {cloneDeep} from "lodash";

export const addInfinity = (panels) => {
    return panels.map(x => ({
        ...x,
        maxRowCount: x.maxRowCount === "Infinity" ? Infinity : x.maxRowCount,
        maxColumnCount: x.maxColumnCount === "Infinity" ? Infinity : x.maxColumnCount
    }));
};

export const filterDataPoints = (panels) => {
    return panels.map(x => ({...x, cards: filterCards(x.cards)}))
}
const filterCards = (cards) => (cards.map(c => ({
    ...c,
    ...(c.graphInfo && {graphInfo: filterGraphInfo(c.graphInfo)}),
    ...(c.growth && {growth: filterGrowthData(c.growth)}),
    filters: {
        ...c.filters,
        ...(c.filters.data && c.filters.data.length && {data: c.filters.data.map(d => filterGrowthData(d))})
    },
})));
const filterGraphInfo = ({xAxes, yAxes, rows, ...graphInfo}) => ({...graphInfo});
const filterGrowthData = (growth) => ({...growth, value: '', changeInValue: ''});

export function setHeaderHeight(commit) {
    let screen_width = screen.width;
    if (screen_width < 1050) {
        commit(LAYOUT_FOR_MOBILE_DEVICE);
    } else if (screen_width > 1200) {
        commit(LAYOUT_FOR_EXTRA_LARGER_DEVICE, screen_width);
    } else if (screen_width < 1220) {
        commit(LAYOUT_FOR_LARGER_DEVICE);
    }
}

function makeRestOfTheCardsInactive(data, index) {
    return data.map((d, i) => {
        if (index !== i) {
            d.isSelected = false;
        }
        return d;
    });
}

export function checkIfDashboardCategory(pageName) {
    return pageName === ANALYTICS_PAGES.DASHBOARD || pageName === ANALYTICS_PAGES.NINJA;
}

export function saveSeedFilters(commit, seedFilters, pageName = ANALYTICS_PAGES.DASHBOARD) {
    commit(SET_SEED_FILTERS, {
        page: pageName,
        value: {[FILTER_TYPES.GLOBAL_FILTERS]: seedFilters}
    });
    const globalFilters = seedFilters.filter(x => !!x.defaultValue).reduce((acc, x) => {
        acc[x.id] = x.defaultValue;
        return acc;
    }, {})
    commit(SAVE_ALL_FILTERS, {pageName: pageName, [FILTER_TYPES.GLOBAL_FILTERS]: globalFilters});
}

function setNavLinkForScorecards(data, commit) {
    if (data[0].cards[0].graphInfo.dataSource && data[0].cards[0].filters && data[0].cards[0].filters.data) {
        const currentGraphDatasource = data[0].cards[0].graphInfo.dataSource;
        const selectedIndex = data[0].cards[0].filters.data.findIndex(x => x.chartUrl === currentGraphDatasource);
        const selectedFilterIndex = selectedIndex === -1 ? 0 : selectedIndex;
        data[0].cards[0].filters.data = makeRestOfTheCardsInactive(data[0].cards[0].filters.data, selectedFilterIndex);
        commit(SET_NAV_LINK, {
            pageName: ANALYTICS_PAGES.DASHBOARD,
            navLink: data[0].cards[0].filters.data[selectedFilterIndex].navlink
        });
    }
}

export function setDashboardData(res, commit) {
    const data = addInfinity(res.data.dlayout.panels);
    const isDefault = res.data.isDefault;
    setNavLinkForScorecards(data, commit);
    commit(ADMIN_SET_DASHBOARD_DATA, data);
    setDefaultFilters(data, commit);
    commit(SET_IS_DEFAULT_LAYOUT, {page: ANALYTICS_PAGES.DASHBOARD, value: isDefault});
    if (res.data.seedFilters) {
        saveSeedFilters(commit, res.data.seedFilters);
    }
    setHeaderHeight(commit);
}

function cleanData(data) {
    data[0].cards[0].extraProps.hideGraphOptions.timeFilters = {
        values: data[0].cards[0].extraProps.hideGraphOptions.timeFilters,
        default: 'monthly'
    }
    return data
}

function setDefaultFilters(data, commit, panelIndex = 0, cardIndex = 0) {
    if (!data[panelIndex].cards[cardIndex].extraProps.hideGraphOptions || !data[panelIndex].cards[cardIndex].extraProps.hideGraphOptions.timeFilters) {
        return;
    }
    const chartId = data[panelIndex].cards[cardIndex].id;
    const defaultValue = data[panelIndex].cards[cardIndex].extraProps.hideGraphOptions.timeFilters.default;
    commit(SAVE_COMPONENT_SPECIFIC_FILTERS, {
        pageName: ANALYTICS_PAGES.DASHBOARD,
        filterId: chartId,
        timeFilter: defaultValue,
    })
}

export function setDefaultRefreshTokens(availablePages) {
    return Object.values(availablePages).reduce((a, k) => {
        a[k] = {};
        return a;
    }, {})
}

export function setDefaultValuesForPages(availablePages, values) {
    return Object.values(availablePages).reduce((a, k, i) => {
        a[k] = Array.isArray(values) && values[i] ? values[i] : values;
        return a;
    }, {})
}

export function spliceIndices(arr, spliceIndices) {
    if (!Array.isArray(arr)) {
        return [];
    }
    const originalArr = cloneDeep(arr);
    if (!spliceIndices || !spliceIndices.length) {
        return [];
    }
    spliceIndices.forEach(index => originalArr.splice(index, 1));
    return originalArr;
}

export function cleanFilters(filters) {
    Object.keys(filters).filter(x => !filters[x] || (Array.isArray(filters[x]) && filters[x].length === 0)).forEach(x => delete filters[x])
    return filters;
}

function assignSalesChannelType(url) {
    if (!url) {
        return SALES_CHANNEL_TYPE.E_COMM;
    }
    const MATCHING_STRING = 'fyndstore.co'
    if (url.slice(-MATCHING_STRING.length).toLowerCase() === MATCHING_STRING) {
        return SALES_CHANNEL_TYPE.FYND_STORE;
    }
    return SALES_CHANNEL_TYPE.E_COMM;
}

/**
 * applications can be either of fynd store type or ecomm, those websites' link not fyndstore at the suffix will be qualified for fyndstore rest are ecomm
 * @param obj
 * @returns {{value}}
 */
function getValueForSalesChannelApplications(obj) {
    return {type: assignSalesChannelType(getPrimaryDomain(obj.domains)), url: getPrimaryDomain(obj.domains)};
}

function getValueForSalesChannelMarketPlaces(obj) {
    return {type: SALES_CHANNEL_TYPE.MARKET_PLACES};
}

export function getSalesChannelIds(applicationIds, marketplaceIds) {

    const ids = Object.entries(applicationIds).reduce((a, item) => {
        a[item[0]] = getValueForSalesChannelApplications(item[1]);
        return a;
    }, {})
    return Object.entries(marketplaceIds).reduce((a, item) => {
        a[item[1][0].icon] = getValueForSalesChannelMarketPlaces(item[1]);
        return a;
    }, ids);
}

export function getLayoutName(pageName) {
    switch (pageName) {
        case ANALYTICS_PAGES.DASHBOARD:
            return 'dashboard';
        case ANALYTICS_PAGES.REPORTS:
            return 'reports';
        case ANALYTICS_PAGES.NINJA:
            return 'dashboard_ninja';
        default:
            return 'dashboard';
    }
}