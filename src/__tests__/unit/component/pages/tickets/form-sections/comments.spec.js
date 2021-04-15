'use strict';

import axios from 'axios';
import VueRouter from 'vue-router';
import MockAdapter from 'axios-mock-adapter';
import { shallowMount, mount, createLocalVue } from '@vue/test-utils';
import comments from '@/pages/tickets/form-sections/comments.vue'
import ADMIN_URLS from '@/services/domain.service';

let localVue;
const mock = new MockAdapter(axios);
describe('Comment', () => {

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
    })

    it('renders comment section', () => {
        const wrapper = shallowMount(comments, {
            propsData: { allComments: [] }
        })
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
        expect(wrapper.classes()).toContain('comment-section');
    })

    it('test zero comment state', () => {
        const wrapper = shallowMount(comments, {
            propsData: { allComments: [] }
        })
        const commentsList = wrapper.findAll('.comment');
        const addCommentList = wrapper.findAll('.add-comment');
        expect(commentsList.length).toBe(0);
        expect(addCommentList.length).toBe(1);
        expect(wrapper.findAllComponents({ name: 'nitrozen-input' }).length).toBe(1);
        expect(wrapper.findAllComponents({ name: 'nitrozen-button' }).length).toBe(1);
    })

    it('test comments in comment-section', () => {
        const router = new VueRouter({
            routes: [
                { path: '/administrator/support/ticket/:ticket_id/edit', component: comments }
            ]
        })
        router.push('/administrator/support/ticket/604bb0835f00e4e3d5d26248/edit');
        const wrapper = shallowMount(comments, {
            localVue,
            router,
            computed: {
                userdata() {
                    const data = { user: { _id: '5e79e721768c6bf54b783146' } };
                    return data;
                }
            },
            propsData: { allComments: [{ "_id": "5fb623a2e1480371f3913416", "ticket_id": "604bb0835f00e4e3d5d26248", "type": "comment", "value": { "text": "Hey how are u doin", "media": [] }, "created_on": { "user_agent": "PostmanRuntime/7.26.8", "platform": "web", "meta": { "browser": { "name": "", "version": "" } } }, "created_by": { "gender": "male", "accountType": "user", "active": true, "profilePicUrl": "https://d2co8r51m5ca2d.cloudfront.net/inapp_banners/default_profile_img.png", "hasOldPasswordHash": false, "_id": "5e79e721768c6bf54b783146", "emails": [{ "active": true, "primary": true, "verified": true, "email": "nikhilmshchs@gmail.com" }, { "active": true, "primary": false, "verified": true, "email": "nikhilmanapure@gofynd.com" }, { "active": true, "primary": false, "verified": true, "email": "nikhilmanapure@fynd.com" }, { "active": true, "primary": false, "verified": true, "email": "nikhilmanapure@uniket.store" }], "phoneNumbers": [{ "active": true, "primary": true, "verified": true, "countryCode": 91, "phone": "9890425946" }], "firstName": "Nikhil", "lastName": "Manapure", "username": "nikhilmanapure_gofynd_com_29298", "createdAt": "2020-03-24T10:55:29.298Z", "updatedAt": "2020-05-12T07:46:41.816Z", "uid": "5567", "__v": 2 }, "createdAt": "2020-11-19T07:49:54.327Z", "updatedAt": "2020-11-19T07:49:54.327Z", "__v": 0, "id": "5fb623a2e1480371f3913416" }, { "_id": "5fb65fe0e148036db691341e", "ticket_id": "5f89ca81ce7d6ea7cdf32818", "type": "comment", "value": { "text": "This is the second comment", "media": [] }, "created_on": { "user_agent": "curl/7.64.1", "platform": "web", "meta": { "browser": { "name": "", "version": "" } } }, "created_by": { "gender": "male", "accountType": "user", "active": true, "profilePicUrl": "https://d2co8r51m5ca2d.cloudfront.net/inapp_banners/default_profile_img.png", "hasOldPasswordHash": false, "_id": "5e79e721768c6bf54b783146", "emails": [{ "active": true, "primary": true, "verified": true, "email": "nikhilmshchs@gmail.com" }, { "active": true, "primary": false, "verified": true, "email": "nikhilmanapure@gofynd.com" }, { "active": true, "primary": false, "verified": true, "email": "nikhilmanapure@fynd.com" }, { "active": true, "primary": false, "verified": true, "email": "nikhilmanapure@uniket.store" }], "phoneNumbers": [{ "active": true, "primary": true, "verified": true, "countryCode": 91, "phone": "9890425946" }], "firstName": "Nikhil", "lastName": "Manapure", "username": "nikhilmanapure_gofynd_com_29298", "createdAt": "2020-03-24T10:55:29.298Z", "updatedAt": "2020-05-12T07:46:41.816Z", "uid": "5567", "__v": 2 }, "createdAt": "2020-11-19T12:06:56.676Z", "updatedAt": "2020-11-19T12:06:56.676Z", "__v": 0, "id": "5fb65fe0e148036db691341e" }] }
        })
        const commentsList = wrapper.findAll('.comment');
        expect(commentsList.length).toBe(2);
        expect(wrapper.findAll('p').length).toBeGreaterThanOrEqual(4);
        expect(wrapper.text()).toContain('Hey how are u doin');
        expect(wrapper.text()).toContain('This is the second comment');
    })

    it('test adding comment', async () => {
        const router = new VueRouter({
            routes: [
                { path: '/administrator/support/ticket/:ticket_id/edit', component: comments }
            ]
        })
        router.push('/administrator/support/ticket/604bb0835f00e4e3d5d26248/edit');
        const wrapper = mount(comments, {
            localVue,
            router,
            computed: {
                userdata() {
                    const data = { user: { "gender": "male", "accountType": "user", "active": true, "profilePicUrl": "https://d2co8r51m5ca2d.cloudfront.net/inapp_banners/default_profile_img.png", "hasOldPasswordHash": false, "_id": "5e79e721768c6bf54b783146", "emails": [{ "active": true, "primary": true, "verified": true, "email": "nikhilmshchs@gmail.com" }, { "active": true, "primary": false, "verified": true, "email": "nikhilmanapure@gofynd.com" }, { "active": true, "primary": false, "verified": true, "email": "nikhilmanapure@fynd.com" }, { "active": true, "primary": false, "verified": true, "email": "nikhilmanapure@uniket.store" }], "phoneNumbers": [{ "active": true, "primary": true, "verified": true, "countryCode": 91, "phone": "9890425946" }], "firstName": "Nikhil", "lastName": "Manapure", "username": "nikhilmanapure_gofynd_com_29298", "createdAt": "2020-03-24T10:55:29.298Z", "updatedAt": "2020-05-12T07:46:41.816Z", "uid": "5567", "__v": 2 } }
                    return data;
                }
            },
            propsData: { allComments: [] }
        })

        expect(wrapper.findAll('.comment').length).toBe(0);
        const addCommentMockData = { "_id": "5fb7b3acb018887582f14f03", "ticket_id": "604bb0835f00e4e3d5d26248", "type": "comment", "value": { "text": "This is a new comment", "media": [] }, "created_on": { "user_agent": "curl/7.64.1", "platform": "web", "meta": { "browser": { "name": "", "version": "" } } }, "created_by": "5e79e721768c6bf54b783146", "createdAt": "2020-11-20T12: 16: 44.286Z", "updatedAt": "2020-11-20T12: 16: 44.286Z", "__v": 0 };
        mock.onPost(ADMIN_URLS.ADD_COMMENT('604bb0835f00e4e3d5d26248')).reply(200, addCommentMockData);
        wrapper.setData({ newComment: 'This is a new comment' });
        wrapper.setData({ isSubmitable: true });
        wrapper.vm.addComment();
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(wrapper.findAll('.comment').length).toBe(1);
        const comment = wrapper.find('.comment');
        expect(comment.text()).toContain('This is a new comment');
        expect(wrapper.vm.loading).toBe(false);
        expect(wrapper.vm.newComment).toBe('');
    });
})