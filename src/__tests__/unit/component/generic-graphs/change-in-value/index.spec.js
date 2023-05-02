import ChangeInValue from "../../../../../components/generic-graphs/change-in-value";
import {mount} from "@vue/test-utils";
import flushPromises from "flush-promises";

const value = 10;
let wrapper = null;

describe('change in value', () => {

    beforeAll(() => {
        wrapper = mount(ChangeInValue, {propsData: {value: value}})
    })

    beforeEach(async () => {
        wrapper.setProps({value: value});
        await flushPromises();
    });

    it('should render', function () {
        expect(wrapper.find('h6').text()).toBeTruthy();
        expect(wrapper.find('h6').text()).toBe(`${value}%`);
    });

    it('should render red color on negative value', async function () {
        const negativeValue = -10;
        wrapper.setProps({value: negativeValue});
        await flushPromises();
        expect(wrapper.find('h6').classes()).toContain('red');
    });

    it('should render green color on positive value', async function () {
        expect(wrapper.find('h6').classes()).toContain('green');
    });

    it('should render green color for forcefully applied values through props', async function () {

        wrapper.setProps({arrowColor: 'green' });
        await flushPromises();

        expect(wrapper.find('h6').classes()).toContain('green');
    });

    it('should render red color for forcefully applied values through props', async function () {
        wrapper.setProps({arrowColor: 'red' });
        await flushPromises();
        expect(wrapper.find('h6').classes()).toContain('red');
    });
});