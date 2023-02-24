'use strict';
/* Package imports */
import { mount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import flushPromises from 'flush-promises';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

/* Component imports */
import uploadConsentDrawer from '@/pages/oms/manifest/upload-consent-drawer.vue';
import ManifestHomePage from '@/pages/oms/manifest/index.vue';

/* Mock imports */
import MANIFEST_DETAILS_RESPONSE from '../fixtures/manifest/manifest-detail-response.json';
import ORDER_ROLES from '../fixtures/order-roles.json';
import ACCESS_DETAIl from '../fixtures/access-detail.json';

/*Domanin imports */
import URLS from '@/services/domain.service';

const mock = new MockAdapter(axios);
let wrapper, router, localVue;
describe('uploadConsentDrawer', () => {
    beforeEach(async() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        router = new VueRouter({
            routes: [
                { path: '/orders/manifest', name: 'company-order-manifest', component: ManifestHomePage},
            ]
        })
        router.push(`/company/1/orders/manifest/`);
        wrapper = mount(uploadConsentDrawer, {
            localVue,
            router,
            propsData: { entryPoint: 'generate',
            manifestId: 'MN0000000150',
            orderRoles: ORDER_ROLES
           },
            computed: {
                accessDetail: ()=> ACCESS_DETAIl
            }
        });
        mock.onGet(URLS.FETCH_MANIFEST_DETAILS()).reply(200, MANIFEST_DETAILS_RESPONSE);
        mock.onPost(URLS.GET_PUBLIC_URL()).reply(200, {
            "urls": [
                {
                    "url": "https://fynd-staging-assets-private.s3.ap-south-1.amazonaws.com/x0/documents/manifest/PDFs/2023/01/07/1410480/MN0000000184.pdf",
                    "signed_url": "https://fynd-staging-assets-private.s3-accelerate.amazonaws.com/x0/documents/manifest/PDFs/2023/01/07/1410480/MN0000000184.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJUADR2WMPQT6ZJ2Q%2F20230110%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20230110T111948Z&X-Amz-Expires=300&X-Amz-Signature=fc9e212ddea2b4183f305c4175acb85a2645073cbd9a0f52aaea6d31823e4da9&X-Amz-SignedHeaders=host",
                    "expiry": 300
                }
            ]
        });
        mock.onPost('https://api.xyz.com/service/platform/assets/v1.0/company/1/application/000000000000000000000001/namespaces/misc/upload/start/').reply(200, {
            "file_name": "MN0000000184.pdf",
            "operation": "putObject",
            "size": 19257,
            "namespace": "misc",
            "content_type": "application/pdf",
            "file_path": "/misc/general/free/original/DwyRyoopG-MN0000000184.pdf",
            "method": "PUT",
            "tags": [],
            "upload": {
                "url": "https://fynd-staging-assets.s3-accelerate.amazonaws.com/x0/misc/general/free/original/DwyRyoopG-MN0000000184.pdf?Content-Type=application%2Fpdf&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJUADR2WMPQT6ZJ2Q%2F20230110%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20230110T120314Z&X-Amz-Expires=1800&X-Amz-Signature=09d8324c16288551dcf7124065590dda60b367ae4b6214a101d4ce14fba8e20f&X-Amz-SignedHeaders=host%3Bx-amz-acl&x-amz-acl=public-read",
                "expiry": 1800
            },
            "cdn": {
                "url": "https://cdn.pixelbin.io/v2/falling-surf-7c8bb8/fyndnp/wrkr/x0/misc/general/free/original/DwyRyoopG-MN0000000184.pdf"
            }
        });
        mock.onPut('https://fynd-staging-assets.s3-accelerate.amazonaws.com/x0/misc/general/free/original/DwyRyoopG-MN0000000184.pdf?Content-Type=application%2Fpdf&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJUADR2WMPQT6ZJ2Q%2F20230110%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20230110T120314Z&X-Amz-Expires=1800&X-Amz-Signature=09d8324c16288551dcf7124065590dda60b367ae4b6214a101d4ce14fba8e20f&X-Amz-SignedHeaders=host%3Bx-amz-acl&x-amz-acl=public-read').reply(200 );
        mock.onPost('https://api.xyz.com/service/platform/assets/v1.0/company/1/application/000000000000000000000001/namespaces/misc/upload/complete/').reply(200,{
            "file_name": "MN0000000184.pdf",
            "file_path": "/misc/general/free/original/DwyRyoopG-MN0000000184.pdf",
            "success": true,
            "namespace": "misc",
            "content_type": "application/pdf",
            "size": 19257,
            "operation": "putObject",
            "tags": [],
            "cdn": {
                "url": "https://cdn.pixelbin.io/v2/falling-surf-7c8bb8/fyndnp/wrkr/x0/misc/general/free/original/DwyRyoopG-MN0000000184.pdf"
            },
            "upload": {
                "url": "https://fynd-staging-assets.s3-accelerate.amazonaws.com/x0/misc/general/free/original/DwyRyoopG-MN0000000184.pdf?Content-Type=application%2Fpdf&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJUADR2WMPQT6ZJ2Q%2F20230110%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20230110T120314Z&X-Amz-Expires=1800&X-Amz-Signature=09d8324c16288551dcf7124065590dda60b367ae4b6214a101d4ce14fba8e20f&X-Amz-SignedHeaders=host%3Bx-amz-acl&x-amz-acl=public-read",
                "expiry": 1800
            },
            "_id": "63bd54039b84ce65f279e326",
            "created_by": {
                "username": "sameershaikh_gofynd_com_70041"
            },
            "company_id": 597,
            "created_on": "2023-01-10T12:03:15.050Z",
            "modified_on": "2023-01-10T12:03:15.050Z"
        } );
    });

  

    it('Click of dispatch button should take us to the manifest home page', async() => {
        mock.onPost(URLS.MANIFEST_DISPATCH()).reply(200, {
            "success": true,
            "message": "Dispatched for manifest MN0000000191"} )
        wrapper.setData({
            manifestStatus: 'pdf_generated',
            declarationChecked: false
        })
        await flushPromises();
        let routerBack = jest.spyOn(router, "push");
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        const element = wrapper.findComponent({ref: 'apply-filter-button'});
        element.vm.$emit('click');
        await wrapper.vm.$nextTick();
        await flushPromises();

        expect(routerBack).toHaveBeenCalled();
    });
    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });
    it('upload consent drawer renders', () => {
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    });

    it('manfiesf detaial catch api fail', async()=>{
        const showError = jest.spyOn(wrapper.vm.$snackbar.global, 'showError');
        wrapper = mount(uploadConsentDrawer, {
            localVue,
            router,
            propsData: { entryPoint: 'generate',
            manifestId: 'MN0000000150',
            orderRoles: ORDER_ROLES
           },
            computed: {
                accessDetail: ()=> ACCESS_DETAIl
            }
        });
        mock.onGet(URLS.FETCH_MANIFEST_DETAILS()).reply(400, {});
        await flushPromises();
        await wrapper.vm.$nextTick();
        expect(showError).toHaveBeenCalled();

    });
   
    it('should poll the manifest in positive case', async()=>{
        wrapper = mount(uploadConsentDrawer, {
        localVue,
        router,
        propsData: { entryPoint: 'home',
        manifestId: 'MN0000000150',
        orderRoles: ORDER_ROLES,
        manifestStatus: 'complete'
        },
        computed: {
            accessDetail: ()=> ACCESS_DETAIl
        }
    });
     
    wrapper.vm.pollManifestDetails();
     await new Promise(resolve => setTimeout(resolve, 2000)); 
     expect(wrapper.vm.pdfGenerationInProgress).toBe(false) ;
                    
    });
   
});