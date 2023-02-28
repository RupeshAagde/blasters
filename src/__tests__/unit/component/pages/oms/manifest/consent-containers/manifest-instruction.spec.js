'use strict';

/* Package imports */
import { mount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';

/* Component imports */
import ManifestInstructionBox from '@/pages/oms/manifest/consent-containers/manifest-instruction.vue';

let wrapper, router, localVue;
describe('ManifestInstructionBox', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        router = new VueRouter({});
        wrapper = mount(ManifestInstructionBox, {
            localVue,
            router,
        });
    });

    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });

    it('Shipment list item renders', async () => {
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    });
});
