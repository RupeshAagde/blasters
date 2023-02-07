import {displayValueFormatter, getValueFormatterConsideringAmountWeight} from './dataFormatter';
import {CHART_OPTIONS} from '../data/chartOptions';
import {cloneDeep} from 'lodash';

const STEP_SIZE_MAX_LIMITER = 10;
export const OptionsUtil = {
    set(options, graphType) {
        const defaultOptions = CHART_OPTIONS[graphType];
        this.options = cloneDeep({...defaultOptions, ...options});
        return this;
    },

    setTitle(title) {
        this.options.scales.yAxes[0].scaleLabel.labelString = title;
        return this;
    },

    formatYaxis(formatter) {
        this.options.scales.yAxes[0].ticks.callback = (v, i, ticks) => {
            let data = !formatter.enableDynamicSuffix ? {} : getValueFormatterConsideringAmountWeight(v);
            return displayValueFormatter({...formatter, ...data, value: v});
        };
        return this;
    },

    setMinMax(min, max) {
        this.options.scales.yAxes[0].ticks.suggestedMin = min;
        this.options.scales.yAxes[0].ticks.suggestedMax = max;
        return this;
    },
    setGraphStep(step, dataPoints = [0]) {
        const max = Math.max(...dataPoints);
        const min = Math.min(...dataPoints);
        if (Math.abs(max - min) > STEP_SIZE_MAX_LIMITER) {
            return this;
        }
        this.options.scales.yAxes[0].ticks.stepSize = step;
        return this;
    },
    formatXAxisTime() {
        const tickFormatter = {
            ticks: {
                callback: (v, i, ticks) => {
                    return v;
                },
            },
        };
        this.options.scales.xAxes[0].ticks = {
            ...this.options.scales.xAxes[0].ticks,
            ...tickFormatter.ticks,
        };
        return this;
    },

    toggleTicks(shouldDisplay = false) {
        this.options.scales.yAxes[0].ticks.display = shouldDisplay;
        return this;
    },

    timeFormat() {
        const timeConfig = {
            type: 'time',
            time: {
                displayFormats: {
                    hour: `MMM DD'YY HH:mm`,
                    day: `MMM DD`,
                    month: 'D MMM',
                },
            },
        };

        this.options.scales.xAxes.push(timeConfig);
        return this;
    },
    get() {
        return this.options;
    },
};
