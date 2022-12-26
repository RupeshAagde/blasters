const graphLoadingCondition = (item) => {
    return Boolean(item && item.graphInfo && !((item.graphInfo.xAxes && item.graphInfo.yAxes) || (item.graphInfo.columns && item.graphInfo.rows)));
}

export {graphLoadingCondition};