'use strict';
import PackagingCard from '@/components/packaging/common/packaging-card.vue';
import { mount, createLocalVue } from '@vue/test-utils';
import mocks from '../fixtures/mocks';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import { EDIT_PRODUCT } from '../../../../../store/action.type';
let wrapper;
let item = {
   product:{
    name:"Product name - pack of 90",
    media:[{
        url:'image.png'
    }],
    item_code:123
   },
   dimensions:{
    length:'1',
    width:"1",
    height:'2'
   },
   l3_mapping:[]
};
const localVue = createLocalVue()
localVue.use(VueRouter);
localVue.use(Vuex)
let router = new VueRouter()
let store = new Vuex.Store({
    modules:{
        packaging:{
            state:{},
            dispatch:jest.fn(),
            actions:{
                async [EDIT_PRODUCT](){
                    return true
                }
            }
        }
    }
})
describe('packaging card component ', () => {
    beforeEach(async () => {
        wrapper = mount(PackagingCard, {
            propsData: {
                item,
            },
            localVue,router,store
        });
    });
    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });

    it('Order list item renders', async () => {
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    });
    it("should check for product info mapping",()=>{
        expect(wrapper.find('#image-path').attributes().src).toBe(item.product.media[0].url)
        expect(wrapper.find('#product-name').element.textContent.trim()).toBe(item.product.name)
        expect(wrapper.find('#item-code').element.textContent).toBe(item.product.item_code.toString())
        expect(wrapper.find('#product-dimension').element.textContent.trim()).toBe("1x1x2 inch")
        expect(wrapper.find('#pack-info').element.textContent.trim()).toBe("pack of 90")
    })
    it("should test for button click simulation",async()=>{
        let btn = wrapper.find(".packaging-card-button")
        await btn.trigger("click")
    })
    it("shpuld test for getPackInfo wrong case",()=>{
        const resp = wrapper.vm.getPackInfo({name:"test"})
        expect(resp).toBe("NA")
        item.l3_mapping = ["1"]
    })
    it("should check for l3 mapping",()=>{
        expect(wrapper.find('#item-l3-value').element.textContent).toBe('TBD')
    })
});
