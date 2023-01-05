<template>
    <div class="box" :class="type">
        <div class="content">
            <adm-inline-svg class="" :src="getIcon"></adm-inline-svg>
            <p>{{ desc }}</p>
        </div>
    </div>
</template>

<script>
import InlineSvg from '@/components/common/adm-inline-svg.vue';

export default {
    name: 'info-bar',

    components: {
        'adm-inline-svg': InlineSvg
    },
    computed: {
        getIcon() {
            switch (this.type) {
                case 'info':
                    return 'info';
                    break;
                case 'error':
                    return 'error_info';
                    break;
                default:
                    return 'info';
                    break;
            }
        }
    },

    props: {
        type: {
            type: String,
            default: 'info'
        },
        desc: {
            type: String,
            default: ''
        }
    },

    data() {
        return {};
    },
    methods: {}
};
</script>

<style lang="less" scoped>
.box {
    font-weight: 400;
    font-size: 12px;
    line-height: 160%;
    border-radius: 4px;
    margin-top: 16px;

    .content {
        padding: 12px;
        display: flex;
        align-items: center;

        p {
            padding-left: 12px;
        }
    }
}
.info {
    background: #e7eeff;
    border: 1px solid #2e31be;
}
.error {
    background: #fdeded;
    border: 1px solid #cd0909;
}
</style>
