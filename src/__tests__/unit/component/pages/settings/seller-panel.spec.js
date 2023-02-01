import {
    createLocalVue,
    mount,
} from "@vue/test-utils";
import SellerPanel from "./../../../../../pages/settings/seller-panel.vue";
import MockAdapter from 'axios-mock-adapter';
import VueRouter from 'vue-router';
import axios from 'axios';
import URLS from "./../../../../../services/domain.service"
import MOCK_DATA from "./fixtures/seller-panel.json";
import flushPromises from "flush-promises";

const mock = new MockAdapter(axios);
let localVue = createLocalVue()
localVue.use(VueRouter)
let wrapper, router

const getSettings = () => {
    return {
            "visible_on": {
                "web": false,
                "ios": false,
                "android": false
            },
            "display": "",
            "permissions": [],
            "title": "",
            "link": "",
            "icon": "",
            "child": []
        }
}

describe('Mounted Seller Panel', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        mock.onGet(URLS.GET_PANEL_SETTINGS()).reply(200, MOCK_DATA.settings);
        mock.onGet(URLS.GET_PERMISSION()).reply(200, MOCK_DATA.permissions);

        router = new VueRouter({
            routes: [{
                path: '/administrator/settings/platform/seller-panel',
                component: SellerPanel
            }]
        })
        router.push('/administrator/settings/platform/seller-panel');
        wrapper = mount( SellerPanel , {
            localVue,
            router,
        })
        await flushPromises();
    });
    it('settings object is not to be null', async () => {
        expect(wrapper.vm.settingsObj).not.toBeNull();
    })

    it('tab change to mobile', async () => {
        wrapper.vm.$refs["tab"].$emit("tab-change",{index: 1, item: 'Mobile'});
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.deviceType).toBe('mobile')
    })

    it('on edit panel settings', async () => {
        wrapper.vm.$refs["settings"].$emit("seller-panel-show", { type: 'company_level', index: 0, isEdit: true});
        await wrapper.vm.$nextTick();
        let updatedData = JSON.parse(JSON.stringify(wrapper.vm.settingsObj))
        updatedData['desktop']['menu']['company_level'][0]['display'] = 'Pratik'
        wrapper.vm.$refs["sidePanel"].$emit("onSave", {index: 0, data: updatedData['desktop']['menu']['company_level'][0], type: 'company_level', isEdit: true});
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.settingsObj['desktop']['menu']['company_level'][0]['display']).toBe('Pratik')

    })

    it('on add menu', async () => {
        wrapper.vm.$refs["settings"].$emit("seller-panel-show", { data: getSettings(), type: 'company_level', isEdit: false});
        await wrapper.vm.$nextTick();
        let updatedData = JSON.parse(JSON.stringify(wrapper.vm.settingsObj))
        updatedData['desktop']['menu']['company_level'].push({
            "visible_on": {
                "web": true,
                "ios": true,
                "android": true
            },
            "display": "test",
            "permissions": [],
            "title": "test",
            "link": "test",
            "icon": "",
            "child": []
        })
        wrapper.vm.$refs["sidePanel"].$emit("onSave", {index: null, data: updatedData, type: 'company_level', isEdit: false});
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.settingsObj['desktop']['menu']['company_level'].length).toBe(9)

    })

    it('on save settings', async () => {
        mock.onGet(URLS.SAVE_PANEL_SETTINGS()).reply(200, MOCK_DATA.settings);
        wrapper.vm.$refs["save-settings"].$emit("click.stop", wrapper.vm.settingsObj);
    })

    
})