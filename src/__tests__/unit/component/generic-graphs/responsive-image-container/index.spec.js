import {mount} from "@vue/test-utils";
import flushPromises from "flush-promises";
import ResponsiveImageContainer from "../../../../../components/generic-graphs/responsive-image-container";

const src = 'image-url';
let wrapper = null;

describe('responsive image container', () => {

    beforeAll(() => {
        wrapper = mount(ResponsiveImageContainer, {propsData: {src: src}})
    })

    beforeEach(async () => {
        wrapper.setProps({value: src});
        await flushPromises();
    });

    it('should load component', function () {
        expect(wrapper.find('img')).toBeTruthy()
    });

    it('should not load component when no src', async function () {
        wrapper.setProps({src: null});
        await flushPromises();
        expect(wrapper.find('img').exists()).toBeFalsy()
    });

});