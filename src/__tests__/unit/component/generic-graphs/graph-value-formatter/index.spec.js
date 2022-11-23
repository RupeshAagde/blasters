import {mount} from "@vue/test-utils";
import flushPromises from "flush-promises";
import GraphValueFormatter from "../../../../../components/generic-graphs/graph-value-formatter";

const value = 10;
let wrapper = null;

describe('change in value', () => {

    beforeAll(() => {
        wrapper = mount(GraphValueFormatter, {propsData: {value: value}})
    })

    beforeEach(async () => {
        wrapper.setProps({value: value});
        await flushPromises();
    });

    it('should load component', function () {
        expect(wrapper.find('span').text()).toBeTruthy();
        expect(wrapper.find('span').text()).toBe(`${value}`);
    });

    it('should load component with value', async function () {
        const val = 1000000;
        const config = {
            prefixSymbol: "$",
            suffixSymbol: "M",
            divisor: 1000000
        }
        wrapper.setProps({value: val, config: config});
        await flushPromises()

        expect(wrapper.find('span').text()).toBe(`$1M`);
    });

    it('should return text unchanged if value is not number', async function () {
        const val = 'test';
        wrapper.setProps({value: val});
        await flushPromises()

        expect(wrapper.find('span').text()).toBe(val);
    });
});