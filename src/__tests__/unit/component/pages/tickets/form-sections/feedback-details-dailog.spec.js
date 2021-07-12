'use strict';

import VueRouter from 'vue-router';
import { mount, createLocalVue } from '@vue/test-utils';
import dialog from '@/pages/tickets/form-sections/feedback-details-dailog.vue'

let localVue;
describe('Feedback Details Dailog', () => {

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
    })

    it('renders dialog', () => {
        const wrapper = mount(dialog)
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
        expect(wrapper.findComponent({ref: 'feedback-details-dailog'}).exists()).toBe(true)
        const feedbackList = wrapper.findAll('.feedback');
        expect(feedbackList.length).toBe(0);
    })

    it('test dialog with feedback', async () => {
        const wrapper = mount(dialog)
        const detailsDailog = wrapper.findComponent({ref: 'feedback-details-dailog'});
        expect(detailsDailog.exists()).toBe(true)
        let mockData = {"response":[{"display":"How was the service?","key":"test-input-22","value":"Test feedback"},{"display":"Satisfied?","key":"test","value":true},{"display":"Rate","key":"rate","value":"5"}],"_id":"60c9b5c5c3ceca435b39ac4d","company_id":"1","ticket_id":"60a4deb71c22b47b0514e353","user":{"active":true,"lastName":"Maurya","_id":"5f8147abbd1a0a870f61f1a6","emails":[{"email":"satyenmaurya95@gmail.com","active":true,"primary":true,"verified":true}],"__v":0,"uid":"5678","updated_at":"2020-10-10T05:33:31.119Z","phoneNumbers":[{"active":true,"phone":"8412805281","countryCode":91,"country_code":91,"verified":true,"primary":true}],"last_name":"Maurya","first_name":"Satyen","account_type":"user","profilePicUrl":"https://hdn-1.fynd.com/company/884/applications/000000000000000000000001/theme/pictures/free/original/default-profile_nxhzui.png","has_old_password_hash":false,"firstName":"Satyen","profile_pic_url":"https://hdn-1.fynd.com/company/884/applications/000000000000000000000001/theme/pictures/free/original/default-profile_nxhzui.png","created_at":"2020-10-10T05:33:31.119Z","accountType":"user","debug":{"source":"grimlock","platform":"test"},"hasOldPasswordHash":false,"gender":"male","createdAt":"2020-10-10T05:33:31.119Z","updatedAt":"2020-10-10T05:33:31.119Z","username":"satyenmaurya95_gmail_com_11118","phone_numbers":[{"active":true,"phone":"8412805281","countryCode":91,"country_code":91,"verified":true,"primary":true}],"authenticated":true,"user_id":"5f8147abbd1a0a870f61f1a6"},"category":"blogs","createdAt":"2021-06-16T08:26:45.784Z","updatedAt":"2021-06-16T08:26:45.784Z","__v":0};
        wrapper.vm.openFeedback(mockData);
        await new Promise(resolve => setTimeout(resolve, 10));
        const feedbackList = wrapper.findAll('.feedback');
        console.log(feedbackList);
        expect(feedbackList.length).toBe(3);
    })
})