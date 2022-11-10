export const GRAPH_TYPES = {
    LINE: "line",
    BAR: "bar",
    TABLE: "table",
    PROGRESS_BAR: "progress-bar",
    FUNNEL: "funnel",
    TABLE_V2: "table-v2"
};

export const FILTER_VIEW = {
    CARDS: "CARDS",
    DROP_DOWN: "DROP_DOWN",
    CONDITIONAL: "CONDITIONAL",
};
/**
 * file names for the up and down arrow svgs
 * @type {{DOWN: string, UP: string}}
 */
export const ARROW_TYPE = {
    UP: "up-arrow",
    DOWN: "down-graph-arrow"
};
export const ARROW_COLORS = {
    RED: 'red',
    GREEN : 'green',
    NONE: 'none'
}

export const CANVAS_HEIGHT = {
    MOBILE: 180,
    TABLET: 150,
    LARGE_SCREEN: 260,
    EXTRA_LARGE_SCREEN: 300
};

export const ANALYTICS_PAGES = {
    DASHBOARD: "DASHBOARD",
    REPORTS: "REPORTS",
    NINJA: 'NINJA_DASHBOARD'
};

export const NINJA_PAGES = {
    DASHBOARD: "DASHBOARD",
}
/**
 * At report page , there are 2 panels, one for header graph and another for table
 * @type {{TABLE: number, HEADER_GRAPH: number}}
 */
export const REPORT_PAGE_PANELS = {
    HEADER_GRAPH: 0,
    TABLE: 1
};

export const PROGRESS_BAR_OPACITY_OFFSET = 25;

export const TABLE_COLUMN_TYPES = {
    STRING: "string",
    NUMBER: "number",
    GROWTH: "growth",
    IMAGE: "image",
    ICON: "icon",
    STATUS: "status",
    COLLAPSE: "COLLAPSE"
};

export const TABLE_CONFIGS = {
    BASE_KEY: "extraConfigs",
    STYLES: "styles"
};

export const TOTAL_ROW_POSITION = {
    START: 'start',
    END: 'end'
}

export const ROW_DATA_PICKER = {
    [TABLE_COLUMN_TYPES.STRING]: "value",
    [TABLE_COLUMN_TYPES.NUMBER]: "value",
    [TABLE_COLUMN_TYPES.GROWTH]: "growth_value",
    [TABLE_COLUMN_TYPES.IMAGE]: "text"
};

export const COLUMN_TYPES_TO_CARD_MODEL_MAPPER = {
    [TABLE_COLUMN_TYPES.IMAGE]: {image: 'image', productName: 'text'},
    [TABLE_COLUMN_TYPES.NUMBER]: 'value',
    [TABLE_COLUMN_TYPES.STRING]: 'value',
    [TABLE_COLUMN_TYPES.GROWTH]: '',
}

export const HTTP_STATUS_CODES = {
    SERVER_ERROR: 500,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    NO_CONTENT: 204,
    SUCCESS: 200
}

export const ERROR_MESSAGES = {
    [HTTP_STATUS_CODES.SERVER_ERROR]: `Something went wrong! please try again refreshing`,
    [HTTP_STATUS_CODES.NO_CONTENT]: `No data available for selected filter`,
}

export const GENERIC_GRAPHS = [
    GRAPH_TYPES.LINE,
    GRAPH_TYPES.FUNNEL,
    GRAPH_TYPES.BAR
]
export const NUMBERS = {
    THOUSAND : 10 ** 3,
    LAKH : 10 ** 5,
    CRORE : 10 ** 7,
}

export const NUMBER_DENOMINATION = {
    [Number.NEGATIVE_INFINITY]: '',
    [NUMBERS.THOUSAND]: 'K',
    [NUMBERS.LAKH]: 'L',
    [NUMBERS.CRORE]: 'Cr',
}