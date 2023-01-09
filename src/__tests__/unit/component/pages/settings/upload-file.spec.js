import {
    mount,
    createLocalVue
} from "@vue/test-utils";
import UploadFilePage from "./../../../../../pages/settings/page-editor/upload-file.vue";
import MockAdapter from 'axios-mock-adapter';
import VueRouter from 'vue-router';
import axios from 'axios';
import URLS from "../../../../../services/domain.service"
import MOCK_DATA from "./fixtures/custom-page.json";
//import CUSTOM_PAGE_MOCK_DATA from "./fixtures/custom-pages.json";
import flushPromises from "flush-promises";

const mock = new MockAdapter(axios);
let localVue = createLocalVue()
localVue.use(VueRouter)
let wrapper, router

const event = {
    target: {
      files: [
        {
            name: 'dummy.html', 
            size: 220, 
            type: "text/html"
        }
      ],
    },
  }

describe('Mount edit custom page with file page type', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        mock.onGet(URLS.PLATFORM_EDIT_CUSTOM_PAGES('fynd-test-markdown-page')).reply(200, MOCK_DATA.customPageFileData);
        mock.onPut(URLS.PLATFORM_EDIT_CUSTOM_PAGES('614021a58a20d1811ea2f6b6')).reply(200, MOCK_DATA.customPageFileData);
        mock.onPut(URLS.PLATFORM_PUBLISHED('fynd-test-markdown-page')).reply(200, MOCK_DATA.customPageFileData);
        mock.onPost(URLS.GRINDOR_UPLOAD_START('platform-page-assets')).reply(200, MOCK_DATA.uploadFileStartData);
        mock.onPut(MOCK_DATA.uploadFileStartData.upload.url).reply(200, MOCK_DATA.uploadFileStartData);
        mock.onPost(URLS.GRINDOR_UPLOAD_COMPLETE('platform-page-assets')).reply(200, MOCK_DATA.uploadFileCompleteData);
        router = new VueRouter({
            routes: [{
                path: '/administrator/settings/pages/:pagetype/:slug/edit',
                component: UploadFilePage,
                name: 'edit-custom'
            }]
        })
        router.push('/administrator/settings/pages/file/fynd-test-markdown-page/edit');
        wrapper = mount( UploadFilePage , {
            localVue,
            router,
            propsData: {
                value: MOCK_DATA.uploadFileCompleteData.cdn.url
            }
        })
        await flushPromises();
    });
    it('exists wrapper and div', async () => {
        await flushPromises();
        expect(wrapper.vm).toBeTruthy()
        expect(wrapper.element).toMatchSnapshot();

    })
    it('upload file', async () => {
        await flushPromises();
        wrapper.vm.inputFileMeta = { name: '', fileSize: null, progress: null };        
        wrapper.vm.handleInputFile(event.target.files)
        expect(wrapper.vm.content).toBe(MOCK_DATA.uploadFileCompleteData.cdn.url)
        wrapper.vm.inputFileMeta.progress = '100';
    })


})