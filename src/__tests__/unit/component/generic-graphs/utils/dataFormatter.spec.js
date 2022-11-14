const {
    dataFormatter,
    toolTipLabelFormatter,
    tickFormatter,
    displayValueFormatter, getValueFormatterConsideringAmountWeight
} = require('../../../../../components/generic-graphs/utils/dataFormatter');
const {NUMBER_DENOMINATION, NUMBERS} = require("../../../../../components/generic-graphs/data/constants");

test('format value', () => {
    // arrange
    const value = 10;
    const expectedResult = `${value}K`

    // act
    const result = dataFormatter(value);

    // assert
    expect(result).toBe(expectedResult);
});

test('tooltip label formatter for integer value', () => {
    const tooltipItem = [{yLabel: 100, datasetIndex: 0}];
    const data = {datasets: [{label: 'test', valueFormatter: {divisor: 1, prefixSymbol: '$', suffixSymbol: 'K'}}]};
    const expectedResult = `${data.datasets[0].valueFormatter.prefixSymbol}${tooltipItem[0].yLabel}`

    // act
    const result = toolTipLabelFormatter(tooltipItem, data);

    // assert
    expect(result).toBe(expectedResult);
});

test('tick formatter', () => {
    // arrange
    const value = 10;
    const expectedResult = `₹${value}K`

    // act
    const result = tickFormatter(value);

    // assert
    expect(result).toBe(expectedResult);
});

test('displayValueFormatter for positive value', () => {
    // arrange
    const value = {value: 10, divisor: 1, prefixSymbol: '$', suffixSymbol: 'K'};
    const expectedResult = `${value.prefixSymbol}${value.value}${value.suffixSymbol}`

    // act
    const result = displayValueFormatter(value);

    // assert
    expect(result).toBe(expectedResult);
});

test('displayValueFormatter for negative value', () => {
    // arrange
    const value = {value: -1, divisor: 1, prefixSymbol: '$', suffixSymbol: 'K'};
    const expectedResult = `${value.prefixSymbol}${value.value}`

    // act
    const result = displayValueFormatter(value);

    // assert
    expect(result).toBe(expectedResult);
});

test('displayValueFormatter for zero value', () => {
    // arrange
    const value = {value: 0, divisor: 1, prefixSymbol: '$', suffixSymbol: 'K'};
    const expectedResult = value.value

    // act
    const result = displayValueFormatter(value);

    // assert
    expect(result).toBe(expectedResult);
});

test('displayValueFormatter for divisor 0', () => {
    // arrange
    const value = {value: 1, divisor: 0, prefixSymbol: '$', suffixSymbol: 'K'};
    const expectedResult = `${value.prefixSymbol}${value.value}${value.suffixSymbol}`;

    // act
    const result = displayValueFormatter(value);

    // assert
    expect(result).toBe(expectedResult);
});

test('handleZeroValue is working', () => {
    // arrange
    const value = {
        value: 0,
        divisor: 1,
        prefixSymbol: '$',
        suffixSymbol: 'K',
        handleZeroValue: false,
        ignoreDivisorValue: true
    };
    const expectedResult = `${value.prefixSymbol}${value.value}${value.suffixSymbol}`;

    // act
    const result = displayValueFormatter(value);

    // assert
    expect(result).toBe(expectedResult);
});

test('getValueFormatterConsideringAmountWeight is working for 1000', () => {
    // arrange
    const value = NUMBERS.THOUSAND;
    const expectedResult = {divisor: value, suffixSymbol: NUMBER_DENOMINATION[value]};

    // act
    const result = getValueFormatterConsideringAmountWeight(value);

    // assert
    expect(result).toEqual(expectedResult);
});
test('getValueFormatterConsideringAmountWeight is working for lakhs', () => {
    // arrange
    const value = NUMBERS.LAKH;
    const expectedResult = {divisor: value, suffixSymbol: NUMBER_DENOMINATION[value]};

    // act
    const result = getValueFormatterConsideringAmountWeight(value);

    // assert
    expect(result).toEqual(expectedResult);
});
test('getValueFormatterConsideringAmountWeight is working for Cr', () => {
    // arrange
    const value = NUMBERS.CRORE;
    const expectedResult = {divisor: value, suffixSymbol: NUMBER_DENOMINATION[value]};

    // act
    const result = getValueFormatterConsideringAmountWeight(value);

    // assert
    expect(result).toEqual(expectedResult);
});
test('getValueFormatterConsideringAmountWeight is working for Cr edge case', () => {
    // arrange
    const value = NUMBERS.CRORE + 100;
    const divisor = NUMBERS.CRORE;
    const expectedResult = {divisor: divisor, suffixSymbol: NUMBER_DENOMINATION[divisor]};

    // act
    const result = getValueFormatterConsideringAmountWeight(value);

    // assert
    expect(result).toEqual(expectedResult);
});

test('getValueFormatterConsideringAmountWeight is working for 0 value', () => {
    // arrange
    const value = 0;
    const expectedResult = {divisor: 1, suffixSymbol: ''};

    // act
    const result = getValueFormatterConsideringAmountWeight(value);

    // assert
    expect(result).toEqual(expectedResult);
});

test('getValueFormatterConsideringAmountWeight is working for negative value', () => {
    // arrange
    const value = -1;
    const expectedResult = {divisor: 1, suffixSymbol: ''};

    // act
    const result = getValueFormatterConsideringAmountWeight(value);

    // assert
    expect(result).toEqual(expectedResult);
});

test('getValueFormatterConsideringAmountWeight is working for random case', () => {
    // arrange
    const value = 204490;
    const divisor = NUMBERS.LAKH

    const expectedResult = {divisor: divisor, suffixSymbol: NUMBER_DENOMINATION[divisor]};

    // act
    const result = getValueFormatterConsideringAmountWeight(value);

    // assert
    expect(result).toEqual(expectedResult);
});

test('getValueFormatterConsideringAmountWeight is working for negative INFINITY', () => {
    // arrange
    let value = Number.NEGATIVE_INFINITY;
    let divisor = 1

    let expectedResult = {divisor: divisor, suffixSymbol: ''};

    // act
    let result = getValueFormatterConsideringAmountWeight(value);

    // assert
    expect(result).toEqual(expectedResult);
});
test('getValueFormatterConsideringAmountWeight is working for positive INFINITY', () => {
    // arrange
    const value = Number.POSITIVE_INFINITY;

    const expectedResult = {divisor: 1, suffixSymbol: ''};

    // act
    const result = getValueFormatterConsideringAmountWeight(value);

    // assert
    expect(result).toEqual(expectedResult);
});