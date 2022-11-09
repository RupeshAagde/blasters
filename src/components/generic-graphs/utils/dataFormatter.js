import {NUMBER_DENOMINATION, NUMBERS} from "../data/constants";

export function dataFormatter(value) {
    return displayValueFormatter({value, suffixSymbol: "K"});
}

export function toolTipLabelFormatter(tooltipModel, data, index) {
    const valueFormatter = data.datasets[0].valueFormatter;
    return displayValueFormatterForToolTip(valueFormatter, tooltipModel[0].yLabel);
}

export function toolTipAfterFooterFormatter(tooltipModel, data) {
    const currentIndex = tooltipModel[0].index;
    const extraDataToShow = data.datasets[0].extraDataToShow;
    if (!extraDataToShow || !Object.keys(extraDataToShow).length) {
        return null;
    }
    return `percentage: ${extraDataToShow.percentages[currentIndex]}%`;
}

export function toolTipTitleFormatter(tooltipModel, data) {
    return tooltipModel[0].xLabel;
}

export function tickFormatter(value, index, ticks) {
    return displayValueFormatter({value, prefixSymbol: "₹", suffixSymbol: "K"});
}

export function displayValueFormatter({
                                          divisor = 1,
                                          value = 0,
                                          prefixSymbol = "",
                                          suffixSymbol = "",
                                          useNumberFormat = false,
                                          ignoreDivisorValue = false,
                                          handleZeroValue = true
                                      }) {
    if (handleZeroValue && value === 0) {
        return value;
    }
    if (!ignoreDivisorValue && value < divisor) {
        return prefixSymbol + value;
    }
    if (divisor === 0) {
        return prefixSymbol + value + suffixSymbol;
    }
    let calculatedValue = value / divisor;
    if (useNumberFormat) {
        calculatedValue = new Intl.NumberFormat('en-IN', {maximumSignificantDigits: 7}).format(value);
        return prefixSymbol + calculatedValue + suffixSymbol;
    }
    calculatedValue = Math.round(calculatedValue * 100) / 100;
    return prefixSymbol + calculatedValue + suffixSymbol;
}


export function displayValueFormatterForToolTip({divisor = 1, prefixSymbol = "", suffixSymbol = ""}, value = 0) {
    if (value === 0) {
        return `${prefixSymbol}0${suffixSymbol}`;
    }
    return displayValueFormatter({
        prefixSymbol, value: value, divisor: 1, suffixSymbol: '', useNumberFormat: true
    })
}

export function getValueFormatterConsideringAmountWeight(v) {
    const valueFormatter = {
        divisor: 1, suffixSymbol: ''
    };
    const ranges = [{min: Number.NEGATIVE_INFINITY, max: NUMBERS.THOUSAND}, {
        min: NUMBERS.THOUSAND,
        max: NUMBERS.LAKH
    }, {
        max: NUMBERS.CRORE, min: NUMBERS.LAKH
    }, {
        min: NUMBERS.CRORE, max: Number.POSITIVE_INFINITY
    },];

    ranges.forEach(range => {
        if (v >= range.min && v < range.max) {
            valueFormatter.divisor = range.min <= 0 ? 1 : range.min;
            valueFormatter.suffixSymbol = NUMBER_DENOMINATION[range.min];
        }
    })
    return valueFormatter;
}