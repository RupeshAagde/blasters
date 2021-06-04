'use strict';

import { mount, createLocalVue } from '@vue/test-utils';
import Page from '@/pages/tickets/video-call/video-room.vue';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import ADMIN_URLS from '@/services/domain.service';
import { Promise } from 'window-or-global';

var localVue;

const mock = new MockAdapter(axios);

describe('Video Call room', () => {

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
    });

    it('Render the Video Call room', async () => {
        const router = new VueRouter({
            routes: [
                {
                    path: 'adminstrator/support/ticket/:ticket_id/video-room',
                    component: Page
                }
            ]
        })

        const ticketId = '60a4f5a61c22b49f4114e354';
        router.push(`adminstrator/support/ticket/${ticketId}/video-room`);

        mock.onGet(ADMIN_URLS.GET_VIDEO_ROOM_TOKEN(ticketId)).reply(200, { access_token: "asdf asdf" });
        mock.onGet(ADMIN_URLS.FETCH_TICKET(ticketId)).reply(200, {"context":{"company_id":"1"},"content":{"title":"sdfasd","description":"PHA+YXNkZmFzZCBoZWxsbzwvcD4=","attachments":[{"type":"shipment","display":"Shipment ID","value":"16214162934831608790"}]},"status":{"display":"Pending","color":"#eae22b","key":"pending"},"priority":{"display":"Low","color":"#fed766","key":"low"},"tags":[],"_id":"60a4f5a61c22b49f4114e354","category":{"_id":"5f6ee94ce13efe3c73bcac02","display":"Order","key":"order","__v":0,"sub_categories":[{"_id":"60a4dcdf392b1919d2f6641c","key":"test-1","display":"test-1","sub_categories":[]},{"_id":"60a4dcdf392b1944c7f6641d","key":"test-2","display":"test-2","sub_categories":[]}]},"sub_category":{"_id":"60a4dcdf392b1919d2f6641c","key":"test-1","display":"test-1","sub_categories":[]},"created_on":{"user_agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36","platform":"web","meta":{"browser":{"name":"Chrome","version":"89.0.4389.114"},"os":{"name":"macOS","version":"11.2.1"},"platform":{"type":"desktop","vendor":"Apple"},"engine":{"name":"Blink"}}},"source":"platform_panel","created_by":{"id":"5e79e721768c6bf54b783146","user":{"_id":"5e79e721768c6bf54b783146","gender":"male","accountType":"user","active":true,"emails":[{"active":true,"primary":true,"verified":true,"email":"nikhilmshchs@gmail.com"},{"active":true,"primary":false,"verified":true,"email":"nikhilmanapure@gofynd.com"},{"active":true,"primary":false,"verified":true,"email":"nikhilmanapure@fynd.com"},{"active":true,"primary":false,"verified":true,"email":"nikhilmanapure@uniket.store"}],"phoneNumbers":[{"active":true,"primary":true,"verified":true,"countryCode":91,"phone":"9890425946","country_code":91}],"firstName":"Nikhil","lastName":"Manapure","createdAt":"2020-03-24T10:55:29.298Z","updatedAt":"2020-03-24T10:55:29.298Z","uid":"5567","account_type":"user","phone_numbers":[{"active":true,"primary":true,"verified":true,"countryCode":91,"phone":"9890425946","country_code":91}],"first_name":"Nikhil","last_name":"Manapure","created_at":"2020-03-24T10:55:29.298Z","updated_at":"2020-03-24T10:55:29.298Z"}},"ticket_id":"57","createdAt":"2021-05-19T11:25:26.092Z","updatedAt":"2021-05-24T08:42:24.335Z","__v":0,"created_at":"2021-05-19T11:25:26.092Z","updated_at":"2021-05-24T08:42:24.335Z"});
        
        const wrapper = mount(Page, {
            localVue,
            router,
        })
        await new Promise(resolve => setTimeout(resolve, 10));

        expect(wrapper.element).toMatchSnapshot();
        expect(wrapper.exists()).toBeTruthy();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    });
})