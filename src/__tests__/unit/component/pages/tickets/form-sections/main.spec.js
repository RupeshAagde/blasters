'use strict';

import axios from 'axios';
import VueRouter from 'vue-router';
import MockAdapter from 'axios-mock-adapter';
import { mount, createLocalVue } from '@vue/test-utils';
import main from '@/pages/tickets/form-sections/main.vue'

let localVue;
const mock = new MockAdapter(axios);
describe('Main', () => {

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
    })

    it('main section', () => {
        const wrapper = mount(main, {
            computed: {
                isEditOnly() {
                    return true;
                },
                isPlatformTicket() {
                    return true;
                }
            },
            propsData: {
                filters: {},
                staff: [],
                ticket: {"context":{"company_id":"1"},"content":{"title":"hello","description":"PHA+c2RjYXdlIGhmY2EgY2phY2EgamVoIGF2amhldiBmIGpodjwvcD4=","attachments":[]},"status":{"display":"Pending","color":"#eae22b","key":"pending"},"priority":{"display":"Low","color":"#fed766","key":"low"},"assigned_to":null,"tags":[],"is_feedback_pending":false,"_id":"6113354e62f9b48652a9f7b3","category":{"_id":"6110ce5cd67b104388e88ecd","key":"test","display":"Test","sub_categories":[],"__v":0},"created_on":{"user_agent":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36","platform":"web","meta":{"browser":{"name":"Chrome","version":"92.0.4515.131"},"os":{"name":"Linux"},"platform":{"type":"desktop"},"engine":{"name":"Blink"}}},"source":"platform_panel","created_by":{"id":"072dd65c2a955fc5d7fa2bac","user":{"_id":"072dd65c2a955fc5d7fa2bac","gender":null,"accountType":"user","active":true,"firstName":"Roshan","lastName":"Prajapat","phoneNumbers":[{"active":true,"primary":true,"verified":true,"phone":"7340478202","countryCode":91,"country_code":91}],"emails":[],"createdAt":"2021-08-10T11:30:05.892Z","updatedAt":"2021-08-10T11:30:05.892Z","uid":"52","account_type":"user","first_name":"Roshan","last_name":"Prajapat","phone_numbers":[{"active":true,"primary":true,"verified":true,"phone":"7340478202","countryCode":91,"country_code":91}],"created_at":"2021-08-10T11:30:05.892Z","updated_at":"2021-08-10T11:30:05.892Z"}},"ticket_id":"3","createdAt":"2021-08-11T02:26:22.721Z","updatedAt":"2021-08-11T02:26:22.721Z","__v":0,"created_at":"2021-08-11T02:26:22.721Z","updated_at":"2021-08-11T02:26:22.721Z"},
                feedbackList: []
            }
        })
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
        expect(wrapper.classes()).toContain('page-container');
        expect(wrapper.findComponent({ref: 'feedback-anchor'}).exists()).toBe(true)
    })
    
    it('test main in page-container', () => {
        const router = new VueRouter({
            routes: [
                { path: '/administrator/support/ticket/:ticket_id/edit', component: main }
            ]
        })
        router.push('/administrator/support/ticket/6113354e62f9b48652a9f7b3/edit');
        const wrapper = mount(main, {
            localVue,
            router,
            computed: {
                isEditOnly() {
                    return true;
                },
                isPlatformTicket() {
                    return true;
                }
            },
            propsData: {
                filters: {},
                staff: [],
                ticket: {"context":{"company_id":"1"},"content":{"title":"hello","description":"PHA+c2RjYXdlIGhmY2EgY2phY2EgamVoIGF2amhldiBmIGpodjwvcD4=","attachments":[]},"status":{"display":"Pending","color":"#eae22b","key":"pending"},"priority":{"display":"Low","color":"#fed766","key":"low"},"assigned_to":null,"tags":[],"is_feedback_pending":false,"_id":"6113354e62f9b48652a9f7b3","category":{"_id":"6110ce5cd67b104388e88ecd","key":"test","display":"Test","sub_categories":[],"__v":0},"created_on":{"user_agent":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36","platform":"web","meta":{"browser":{"name":"Chrome","version":"92.0.4515.131"},"os":{"name":"Linux"},"platform":{"type":"desktop"},"engine":{"name":"Blink"}}},"source":"platform_panel","created_by":{"id":"072dd65c2a955fc5d7fa2bac","user":{"_id":"072dd65c2a955fc5d7fa2bac","gender":null,"accountType":"user","active":true,"firstName":"Roshan","lastName":"Prajapat","phoneNumbers":[{"active":true,"primary":true,"verified":true,"phone":"7340478202","countryCode":91,"country_code":91}],"emails":[],"createdAt":"2021-08-10T11:30:05.892Z","updatedAt":"2021-08-10T11:30:05.892Z","uid":"52","account_type":"user","first_name":"Roshan","last_name":"Prajapat","phone_numbers":[{"active":true,"primary":true,"verified":true,"phone":"7340478202","countryCode":91,"country_code":91}],"created_at":"2021-08-10T11:30:05.892Z","updated_at":"2021-08-10T11:30:05.892Z"}},"ticket_id":"3","createdAt":"2021-08-11T02:26:22.721Z","updatedAt":"2021-08-11T02:26:22.721Z","__v":0,"created_at":"2021-08-11T02:26:22.721Z","updated_at":"2021-08-11T02:26:22.721Z"},
                feedbackList: []
            }
        })
        const commentsList = wrapper.findAll('.history-label');
        expect(commentsList.length).toBe(1);
        expect(wrapper.text()).toContain("Roshan Prajapat");
    })
})