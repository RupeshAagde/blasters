'use strict';

/* Package imports */
import { mount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';

/* Component imports */
import ManifestDownloadBox from '@/pages/oms/manifest/consent-containers/manifest-download.vue';
import ORDER_ROLES from '../../fixtures/order-roles.json';

let wrapper, router, localVue;
describe('ManifestDownloadBox', () => {
    beforeEach(async () => {
        localVue = createLocalVue();

        localVue.use(VueRouter);
        router = new VueRouter({});
        router.push(`/company/1/orders/manifest/`);

        wrapper = mount(ManifestDownloadBox, {
            localVue,
            router,
            propsData: { entryPoint: 'generate',
            manifestId: 'MN0000000150',
            orderRoles: ORDER_ROLES,
            status: 'pdf_generated',
            downloadUrl: 'xyz.com',
            pdfGenerationInProgress: false
           },
        });
    });

    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });

    it('Shipment list item renders', async () => {
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    });
    it('should emit download on click to the parent component', async () => {
        let downloadBackButton = wrapper.find('.download-btn');
        downloadBackButton.trigger('click');
        await wrapper.vm.$nextTick();
        expect(wrapper.emitted()['download']).toBeTruthy();
    });
});
