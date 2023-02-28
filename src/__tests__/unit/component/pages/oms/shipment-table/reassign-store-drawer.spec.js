/* Package import */
import { mount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import flushPromises from "flush-promises";

/* Component import */
import ReassignStoreDrawer from '@/pages/oms/shipment-table/reassign-store-drawer.vue';

/* Mock import */
import STORE_REASSIGN_DATA from '../fixtures/reassign-store.json';

let wrapper, router, localVue;

describe('store-reassign-drawer', () => {
    beforeEach(async() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        router = new VueRouter({
            routes: [
                { path: 'orders/:orderId/details', name: 'company-order-details-v2', component: ReassignStoreDrawer }
            ]
        });
        router.push(`orders/FY63F47BF30DCB3BFB88/details`);
        wrapper = mount(ReassignStoreDrawer, {
            localVue,
            router,
            propsData: {
                stores: STORE_REASSIGN_DATA.stores,
                reasons: STORE_REASSIGN_DATA.reasons,
                bagId: "426830",
            },
            data() {
                return {
                    search: "",
                    selectedReason: "",
                    selectedStore: "",
                }
            },
        });
        await flushPromises();
    });

    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });

    it('is a Vue instance', () => {
        expect(wrapper.exists()).toBeTruthy();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    });

    it("select reason and store", async () => {
        let reasonDropdown = wrapper.find('.dropdown-reason');
        let addressRadioBtn = wrapper.find('.radio-button');
        reasonDropdown.vm.$emit('input', 104)
        reasonDropdown.vm.$emit('change');
        addressRadioBtn.trigger('click');
        await flushPromises();
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.selectedReason).toBe(104);
        expect(wrapper.vm.selectedStore).toBe(3666);
    });

    it("dropdown outside click", async () => {
        let dropdownDiv = wrapper.find('.dropdown');
        let reasonDropdown = wrapper.find('.dropdown-reason');
        dropdownDiv.trigger('focus');
        dropdownDiv.trigger('blur');
        await flushPromises();
        await wrapper.vm.$nextTick();
        expect(reasonDropdown.vm.showOptions).toBe(false);
    });
});


