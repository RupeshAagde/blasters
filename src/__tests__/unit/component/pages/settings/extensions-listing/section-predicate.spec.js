/* Package imports */
import { mount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';

/* Component imports */
import SectionPredicate from '@/pages/settings/extensions-listing/section-predicate.vue';

let localVue;
let router, wrapper;

describe('Section Predicate Component', () => {
    beforeEach(async() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        router = new VueRouter({
            routes: [
                { path: '/administrator/settings/partners/extensions-listing', component: SectionPredicate }
            ]
        });

        router.push('/administrator/settings/partners/extensions-listing');

        wrapper = mount(SectionPredicate, {
            localVue,
            router
        });
    });

    afterAll(() => {
        mock.reset();
    });

    it('Checks if component is loaded', async () => {
        expect(wrapper.element).toMatchSnapshot();
        expect(wrapper.exists()).toBeTruthy();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    });

    it('should scroll to bottom when the get function is called', async() => {
        wrapper.vm.get();
        expect(wrapper.emitted()).toHaveProperty('scrollBottom');
    });

    it('should update the data when the init function is called with data', async() => {
        wrapper.vm.init({
            section: {
                predicate: {
                    screen: {
                        mobile: true,
                        desktop: false,
                        tablet: false
                    }
                }
            },
            index: 1
        });

        await wrapper.vm.$nextTick();
        expect(wrapper.vm.index).toBe(1);
    })
});
