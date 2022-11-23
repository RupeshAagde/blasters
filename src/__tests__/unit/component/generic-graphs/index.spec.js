import {createLocalVue, mount, shallowMount} from "@vue/test-utils";
import GenericGraphs from "../../../../components/generic-graphs";
import {
    analyticsGenericGraphMixins,
    analyticsTablePropsMixins
} from "../../../../components/generic-graphs/graphs/mixins/analytics-props.mixins";
import {GRAPH_TYPES} from "../../../../components/generic-graphs/data/constants";
import flushPromises from "flush-promises";

const chartId = 10;
let wrapper = null;
const localVue = createLocalVue();
localVue.mixin(analyticsTablePropsMixins);
localVue.mixin(analyticsGenericGraphMixins);
const graphType = GRAPH_TYPES.LINE;


const GenericGraphsModel = {
    render: () => {
    },
    methods: {
        open: () => {
        },
        close: () => {
        }
    }
}

const ErrorHandlerStub = {
    template: `<span/>`
}

describe('generic graphs', () => {

    beforeAll(() => {
        wrapper = mount(GenericGraphs, {
            localVue,
            propsData: {xAxes: [], yAxes: [], type: graphType, chartId: chartId, filters: {}},
            stubs: {
                "no-ssr": GenericGraphsModel,
                "generic-implementation": GenericGraphsModel,
                CustomTableGraph: GenericGraphsModel,
                ProgressBarGraph: GenericGraphsModel,
                ErrorHandlers: ErrorHandlerStub
            }
        })
    })

    // beforeEach(async () => {
    //     wrapper.setProps({value: value});
    //     await flushPromises();
    // });

    it('should load component', function () {
        expect(wrapper.vm.xAxes).toEqual([])
        expect(wrapper.vm.yAxes).toEqual([])
        expect(wrapper.vm.graphType).toEqual(graphType)
        expect(wrapper.vm.chartId).toEqual(chartId)
        expect(wrapper.vm.filters).toEqual({})
        expect(wrapper.find('div').exists()).toBe(true);
    });

    it('should load table for table graphtype', async function () {
        wrapper.setProps({type: GRAPH_TYPES.TABLE});
        await flushPromises();
        expect(wrapper.vm.isGenericGraph).toBe(false);
        expect(wrapper.vm.graphType).toBe(GRAPH_TYPES.TABLE);
    });
    it('should load funnel for funnel graphtype', async function () {
        const gType = GRAPH_TYPES.FUNNEL
        wrapper.setProps({type: gType});
        await flushPromises();
        expect(wrapper.vm.isGenericGraph).toBe(true);
        expect(wrapper.vm.graphType).toBe(gType);
    });
    it('should load line for line graphtype', async function () {
        const gType = GRAPH_TYPES.LINE
        wrapper.setProps({type: gType});
        await flushPromises();
        expect(wrapper.vm.isGenericGraph).toBe(true);
        expect(wrapper.vm.graphType).toBe(gType);
    });
    it('should load progress-bar for progress-bar graphtype', async function () {
        const gType = GRAPH_TYPES.PROGRESS_BAR
        wrapper.setProps({type: gType});
        await flushPromises();
        expect(wrapper.vm.isGenericGraph).toBe(false);
        expect(wrapper.vm.graphType).toBe(gType);
    });

    it('should load no graph if no data point', async function () {
        const gType = GRAPH_TYPES.LINE;
        wrapper.setProps({xAxes: null, yAxes: null});
        await flushPromises();
        expect(wrapper.vm.isSuccess).toBe(false);
    });

});