'use strict';

import { shallowMount, createLocalVue } from '@vue/test-utils';
import EmployeeInfo from '@/pages/orders/employee-info.vue';
import VueRouter from 'vue-router';

let wrapper, router, localVue
describe('Employee Info', () => {
    beforeEach(async() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        router = new VueRouter({
            routes: [
                { path: '/orders/list/', component: EmployeeInfo }
            ]
        })
        router.push(`/orders/list/`);
        const employee = {
            "id": "33bbb820f603a3d99ab5580b",
            "name": "Noman",
            "email": "",
            "employee_code": "",
            "mobile_no": "",
            "gender": "",
            "store_id": "",
            "is_archived": "false",
            "is_active": "true",
            "created_on": "",
            "modified_on": ""
        };
        wrapper = shallowMount(EmployeeInfo, {
            localVue,
            router,
            propsData: { employee: employee, id:"33bbb820f603a3d99ab5580b" }
        });
    });

    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });

    it('Render Check', async() => {
        const div = wrapper.find('div')
        expect(div.exists()).toBe(true)
    });
});