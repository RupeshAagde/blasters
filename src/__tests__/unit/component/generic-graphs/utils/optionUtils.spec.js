import {GRAPH_TYPES} from "../../../../../components/generic-graphs/data/constants";

const {OptionsUtil} = require('../../../../../components/generic-graphs/utils/optionsUtil');
import lodash from 'lodash'

global._ = lodash
const graphType = GRAPH_TYPES.BAR;
const options = {};
let util = null;

beforeEach(() => {
    util = OptionsUtil.set(options, graphType);
});

test('initiate options for the given graph type', () => {
    // assert
    expect(util.get()).toBeTruthy();
});

test('set title for the given graph type', () => {
    // act
    const title = 'Hey testbed!!'
    const result = util.setTitle(title).get();

    // assert
    expect(result).toBeTruthy();
    expect(result.scales.yAxes[0].scaleLabel.labelString).toBe(title);
})

test('format y-axis for the given graph type', () => {
    // act
    const formatter = {divisible: 1, suffixSymbol: 'K', prefixSymbol: '$'};
    const result = util.formatYaxis(formatter).get();

    // assert
    expect(result).toBeTruthy();
    expect(result.scales.yAxes[0].ticks.callback).toBeInstanceOf(Function);
})

test('format y-axis time for the given graph type', () => {
    // act
    const formatter = {divisible: 1, suffixSymbol: 'K', prefixSymbol: '$'};
    const val = 0;
    const result = util.formatXAxisTime(formatter).get();

    // assert
    expect(result).toBeTruthy();
    expect(result.scales.yAxes[0].ticks.callback).toBeInstanceOf(Function);
    expect(result.scales.yAxes[0].ticks.callback(val)).toBe(val);
})

test('toggle ticks for the given graph type', () => {
    // act
    const value = false;
    const result = util.toggleTicks(value).get();

    // assert
    expect(result).toBeTruthy();
    expect(result.scales.yAxes[0].ticks.display).toBe(value);
})

test('time Format for the given graph type', () => {
    // act
    const timeConfig = {
        type: "time", time: {
            displayFormats: {
                hour: `MMM DD'YY HH:mm`,
                day: `MMM DD`,
                month: "D MMM"
            }
        }
    };
    const result = util.timeFormat().get();

    // assert
    expect(result).toBeTruthy();
    expect(result.scales.xAxes.pop()).toEqual(timeConfig);
})