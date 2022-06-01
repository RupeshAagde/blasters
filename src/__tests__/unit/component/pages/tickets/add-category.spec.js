'use strict';

import axios from 'axios';
import VueRouter from 'vue-router';
import MockAdapter from 'axios-mock-adapter';
import { shallowMount, mount, createLocalVue } from '@vue/test-utils';
import ticketCategory from '@/pages/tickets/add-category.vue'
import ADMIN_URLS from '@/services/domain.service';

let localVue;
const mock = new MockAdapter(axios);
describe('Ticket Category Page', () => {

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
    })

    it('renders catgory page', () => {
        const wrapper = shallowMount(ticketCategory)
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    })

    it('test categories rendering after call', async () => {
        const router = new VueRouter({
            routes: [
                { path: '/administrator/support/add-category', component: ticketCategory }
            ]
        })
        router.push('/administrator/support/add-category');
        const wrapper = mount(ticketCategory, {
            localVue,
            router
        })
        const mockCategoryData = { "items": [ { "_id": "5f6ee94ce13efe8864bcac0b", "display": "Blogs", "key": "blogs", "__v": 0, "sub_categories": [ { "_id": "60bf85bac0bf6c7acf36dd12", "key": "hello", "display": "hello", "sub_categories": [] }, { "_id": "60bf85bac0bf6c81cf36dd13", "key": "test", "display": "test", "sub_categories": [] } ], "feedback_form": { "inputs": [ { "type": "text", "showRegexInput": false, "enum": [], "display": "How was the service?", "key": "test-input-22", "required": true }, { "type": "toggle", "display": "Satisfied?", "key": "test", "required": true }, { "type": "dropdown", "showRegexInput": false, "enum": [ { "key": "1", "display": "1" }, { "key": "2", "display": "2" }, { "key": "3", "display": "3" }, { "key": "4", "display": "4" }, { "key": "5", "display": "5" } ], "display": "Rate", "placeholder": "Rate", "required": true, "key": "rate" } ], "title": "Feedback form" } }, { "_id": "608fee37373fa020332e5c4b", "key": "catalog-training", "display": "Catalog Training", "sub_categories": [], "__v": 0 }, { "_id": "5f6ee94ce13efe3368bcac07", "display": "Catalogue", "key": "catalogue", "__v": 0, "sub_categories": [] }, { "_id": "5f6ee94ce13efe4211bcac01", "display": "Coupon", "key": "coupon", "__v": 0, "sub_categories": [] }, { "_id": "5f6ee94ce13efe1b2cbcac06", "display": "Customers", "key": "customers", "__v": 0, "sub_categories": [ { "_id": "608ff155373fa07f5f2e5c76", "key": "hh", "display": "hh", "sub_categories": [] }, { "_id": "608ff155373fa019102e5c77", "key": "h", "display": "h", "sub_categories": [] }, { "_id": "608ff155373fa0597f2e5c78", "key": "hhhhh", "display": "hhhhh", "sub_categories": [] } ] }, { "_id": "5f6ee94ce13efe79babcac05", "display": "Developers", "key": "developers", "__v": 0, "sub_categories": [] }, { "_id": "5f6ee94ce13efe6f03bcac04", "display": "Extensions", "key": "extensions", "__v": 0, "sub_categories": [] }, { "_id": "5f6ee94ce13efe1389bcac09", "display": "Navigations", "key": "navigations", "__v": 0, "sub_categories": [] }, { "_id": "607e9e7d20490eb5af1fbaa2", "key": "new-sample", "display": "New Sample", "sub_categories": [ { "_id": "607ea96420490e08401fbab3", "key": "shirt", "display": "shirt", "sub_categories": [] }, { "_id": "607ea96420490e0ab81fbab4", "key": "pant", "display": "pant", "sub_categories": [] }, { "_id": "607ee406029015864a5ed2cb", "key": "ssss", "display": "ssss", "sub_categories": [] }, { "_id": "607f21400290151fa05ed304", "key": "xyz", "display": "xyz", "sub_categories": [] } ], "__v": 0 }, { "_id": "5f6ee94ce13efe3c73bcac02", "display": "Order", "key": "order", "__v": 0, "sub_categories": [ { "_id": "60a4dcdf392b1919d2f6641c", "key": "test-1", "display": "test-1", "sub_categories": [] }, { "_id": "60a4dcdf392b1944c7f6641d", "key": "test-2", "display": "test-2", "sub_categories": [] }, { "_id": "60c9d8b4e02a4c679ab287f3", "key": "test-3", "display": "test-3", "sub_categories": [] } ] } ] };
        mock.onGet(ADMIN_URLS.FETCH_CATEGORIES()).reply(200, mockCategoryData);
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(wrapper.findAllComponents({name: "add-category"}).length).toBe(1);
    })

    it('test categories edit a category', async () => {
        const router = new VueRouter({
            routes: [
                { path: '/administrator/support/add-category', component: ticketCategory }
            ]
        })
        router.push('/administrator/support/add-category');
        const wrapper = mount(ticketCategory, {
            localVue,
            router
        })
        
        const mockCategoryData = {"items":[{"_id":"6114cac4ca9929529fa7bd9f","key":"order","display":"Order","sub_categories":[],"__v":0,"feedback_form":{"inputs":[{"type":"text","showRegexInput":false,"enum":[],"display":"How was the service?","key":"how-was-the-service","required":true}],"title":"Feedback form"}},{"_id":"6114c5d2ca9929c665a7bd9b","key":"updated-key","display":"updated one","sub_categories":[],"__v":0},{"_id":"611416d645620b7633c86c5d","key":"test","display":"Test","sub_categories":[],"__v":0}]};
        mock.onGet(ADMIN_URLS.FETCH_CATEGORIES()).reply(200, mockCategoryData);
        await new Promise(resolve => setTimeout(resolve, 10));

        wrapper.setData({ cat_name: "updated one" });

        mock.onPost(ADMIN_URLS.FETCH_CATEGORIES()).reply(200, mockCategoryData);
        await new Promise(resolve => setTimeout(resolve, 10));

        wrapper.vm.saveAllField(2)
        await new Promise(resolve => setTimeout(resolve, 10));

        wrapper.setData({ editingCatIdx: 0})
        await new Promise(resolve => setTimeout(resolve, 10));

        expect(wrapper.text()).toContain("updated one");
        expect(wrapper.findAll('.category-details').length).toBe(1);
        expect(wrapper.findAll('.feedback-form').length).toBe(1);
        expect(wrapper.findAll('.freshdesk-config').length).toBe(1);

    })

    it('test add a category', async () => {
        const router = new VueRouter({
            routes: [
                { path: '/administrator/support/add-category', component: ticketCategory }
            ]
        })
        router.push('/administrator/support/add-category');
        const wrapper = mount(ticketCategory, {
            localVue,
            router
        })
        
        const mockCategoryData = {"items":[{"_id":"6114cac4ca9929529fa7bd9f","key":"order","display":"Order","sub_categories":[],"__v":0,"feedback_form":{"inputs":[{"type":"text","showRegexInput":false,"enum":[],"display":"How was the service?","key":"how-was-the-service","required":true}],"title":"Feedback form"}},{"_id":"6114c5d2ca9929c665a7bd9b","key":"updated-key","display":"updated one","sub_categories":[],"__v":0},{"_id":"611416d645620b7633c86c5d","key":"test","display":"Test","sub_categories":[],"__v":0}]};
        mock.onGet(ADMIN_URLS.FETCH_CATEGORIES()).reply(200, mockCategoryData);
        await new Promise(resolve => setTimeout(resolve, 10));

        wrapper.setData({ cat_name: "updated one" });

        mock.onPost(ADMIN_URLS.FETCH_CATEGORIES()).reply(200, mockCategoryData);
        await new Promise(resolve => setTimeout(resolve, 10));

        wrapper.vm.addCategory();
        wrapper.vm.saveAllField(0)
        await new Promise(resolve => setTimeout(resolve, 10));

        wrapper.setData({ editingCatIdx: 0})
        await new Promise(resolve => setTimeout(resolve, 10));

        expect(wrapper.text()).toContain("updated one");
    })
})