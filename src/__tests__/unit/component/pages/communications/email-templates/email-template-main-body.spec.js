'use strict';

import { mount, shallowMount, config, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import ADMIN_URLS from '../../../../../../services/domain.service';
import flushPromises from "flush-promises";
import EmailTemplatesMainBody from '../../../../../../pages/communication/email/email-template-main-body.vue'
import CommsRoutes from '../../../../../../router/index';
import EmailTemplatesMock from './email-templates.json'
import cloneDeep from 'lodash/cloneDeep';

let localVue, wrapper, router;
const mock = new MockAdapter(axios);

const iframe = {
    render: () => {},
    props:['contentDocument'],
    data(){
        return {
            contentDocument:{
                open: () => {
                    return true
                },
                write: () => {
                    return true
                },
                close: () => {
                    return true;
                }        
            }
        }
    },
    methods: {
        open: () => {
            return true
        },
        write: () => {
            return true
        },
        close: () => {
            return true;
        }
    },
}

const emailtemplatemainbody = {
    render: () => {},
    methods: {
        validate: () => {
            return true
        },
        saveForm: () => {
            return true
        },
        openSendTestEmailModal : () => {

        },
        validateAndSave: () => {
            return true;
        }
    },
}

describe('Email Template Variables', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        router = new VueRouter({
            routes:cloneDeep(CommsRoutes)
        })
        router.push('/communication/email/templates/create?clone=5e5653c1d503e0038407fc17');
        wrapper = mount(EmailTemplatesMainBody, {
            stubs:{
                'iframe':iframe,
                emailtemplatemainbody
            },
            computed:{
                emailTemplateStore: ()=>{
                    return EmailTemplatesMock['email_template_to_clone']
                },
                emailTemplateToClone: ()=>{
                    return EmailTemplatesMock['email_template_to_clone']
                },
                userData: ()=>{
                    return EmailTemplatesMock['userData']
                },
            },
            localVue,
            router,
        })
        mock.onGet(ADMIN_URLS.COMMUNICATION_EMAIL_TEMPLATES('602d623aafc3c021fb99b7ed')).reply(200, EmailTemplatesMock['email_template_to_clone']);
        mock.onPut(ADMIN_URLS.COMMUNICATION_EMAIL_TEMPLATES('602d623aafc3c021fb99b7ed')).reply(200, EmailTemplatesMock['email_template_to_clone']);
        mock.onPost(ADMIN_URLS.COMMUNICATION_EMAIL_TEMPLATES()).reply(200, EmailTemplatesMock['create_email_response']);
        mock.onGet(ADMIN_URLS.EMAIL_PROVIDER()).reply(200, EmailTemplatesMock['email_providers']);
        mock.onGet(ADMIN_URLS.COMMS_DEFAULT_EMAIL_PROVIDERS()).reply(200, EmailTemplatesMock['default_providers']);
        // jest.spyOn(wrapper.vm.$refs.previewbody,'get').mockReturnValue({
        //     contentDocument:{
        //         open: () => {
        //             return true
        //         },
        //         write: () => {
        //             return true
        //         },
        //         close: () => {
        //             return true;
        //         }
        //     }
        // })
        await flushPromises();
        // const iframe1 = wrapper.find('iframe');
        // iframe1.contentDocument={
        //     open: () => {
        //         return true
        //     },
        //     write: () => {
        //         return true
        //     },
        //     close: () => {
        //         return true;
        //     }
        // }
        // jest.spyOn(iframe1, 'contentDocument','get').mockReturnValue({
        //     open: () => {
        //         return true
        //     },
        //     write: () => {
        //         return true
        //     },
        //     close: () => {
        //         return true;
        //     }
        // });
        // // jest.mock(iframe,'contentDocument').returns()
    });

    it('Component Render', async () => {
        expect(wrapper.element).toMatchSnapshot();
    });
    it('is a vue instance', async() => {
        expect(wrapper.exists()).toBeTruthy();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
        console.log(wrapper.find('iframe').html());
    })
    it('save form', async() => {
        wrapper.vm.data = EmailTemplatesMock.data
        wrapper.vm.data.editor_type=EmailTemplatesMock.data.editor_type.value
        wrapper.vm.openSendTestEmailModal();
        expect(wrapper.vm.error_text).toBe('')
        expect(wrapper.vm.showSendTestEmailModal).toBe(true)

        let obj={a:'a',b:''}
        wrapper.vm.removeEmptyFields(obj)
        expect(obj.b).toBe(undefined);

        wrapper.vm.selectTemplateEngine(true);
        expect(wrapper.vm.data.subject.template_type.value).toBe('nunjucks');

        wrapper.vm.selectTemplateEngine(false);
        expect(wrapper.vm.data.subject.template_type.value).toBe('static');

        wrapper.vm.importData();
        wrapper.vm.checkmarkData(['User','Application'])
        wrapper.vm.validateAndSave();

        wrapper.vm.sendEmail();
        expect(wrapper.vm.testEmail.to.showerror).toBe(true);


    })


    // it('save form', async() => {
    //     wrapper.vm.openSendTestEmailModal();
    //     expect(wrapper.vm.error_text).toBe('')
    //     expect(wrapper.vm.showSendTestEmailModal).toBe(true)

    //     let obj={a:'a',b:''}
    //     wrapper.vm.removeEmptyFields(obj)
    //     expect(obj.b).toBe(undefined);

    //     wrapper.vm.selectTemplateEngine(true);
    //     expect(wrapper.vm.data.subject.template_type.value).toBe('nunjucks');

    //     wrapper.vm.selectTemplateEngine(false);
    //     expect(wrapper.vm.data.subject.template_type.value).toBe('static');

    //     wrapper.vm.importData();
    //     wrapper.vm.checkmarkData(['User','Application'])

    //     wrapper.vm.emailTemplateStore = EmailTemplatesMock['email_template_to_clone']
    //     wrapper.vm.emailTemplateToClone = EmailTemplatesMock['email_template_to_clone']
    //     await flushPromises();
    //     await wrapper.vm.$nextTick();

    //     let commitFun = jest.spyOn(wrapper.vm.$store, 'commit');
    //     wrapper.vm.validateAndSave();
    //     expect(commitFun).toHaveBeenCalled();


    //     // let dispatchFun = jest.spyOn(wrapper.vm.$store, 'dispatch');
    //     wrapper.vm.sendEmail();
    //     expect(wrapper.vm.testEmail.to.showerror).toBe(true);
    // })

    // it('Edit', async() => {
    //     router.push('/company/1/application/000000000000000000000001/email/templates/edit/602d623aafc3c021fb99b7ed');
    //     wrapper.vm.templateId='602d623aafc3c021fb99b7ed';
    //     let snackbar = jest.spyOn(wrapper.vm.$snackbar.global, 'showSuccess');
    //     wrapper.vm.saveForm();
    //     await flushPromises();
    //     expect(snackbar).toHaveBeenCalled();
    // })

    // it('delete template', async() => {
    //     let snackbar = jest.spyOn(wrapper.vm.$snackbar.global, 'showSuccess');
    //     wrapper.vm.deleteTemplate()
    //     await flushPromises();
    //     expect(snackbar).toHaveBeenCalled();
    // })

    // it('send test and savepublish', async() => {
    //     let snackbar = jest.spyOn(wrapper.vm.$snackbar.global, 'showSuccess');
    //     wrapper.vm.sendTestEmail();
    //     wrapper.vm.saveAndPublish();
    //     wrapper.vm.cloneTemplate();
    //     await flushPromises();
    //     expect(snackbar).toHaveBeenCalled();

    // })
})