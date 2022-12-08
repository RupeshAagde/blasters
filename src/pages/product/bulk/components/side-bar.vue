<template>
    <div>
        <div class="overlay" @click="closeOverlay()"></div>
        <div class="sidebar">
            <div class="sidebar-header">
                <div class="flex-row">
                    <div>{{ history.id }}</div>
                    <slot name="header"></slot>
                </div>
                <div class="close-icon" @click="closeOverlay()">
                    <adm-inline-svg :src="'cross-black'"></adm-inline-svg>
                </div>
            </div>
            <div class="sidebar-body">
                <slot name="body"></slot>
            </div>
            <div v-if="footer" class="sidebar-body-footer">
                <nitrozen-button theme="secondary" v-flatBtn @click="">
                    Save
                </nitrozen-button>
            </div>
        </div>
    </div>
</template>

<script>
import { NitrozenButton, flatBtn, strokeBtn } from '@gofynd/nitrozen-vue';
import adminlinesvg from '@/components/common/adm-inline-svg';
export default {
    name: 'sidebar',
    components: {
        'nitrozen-button': NitrozenButton,
        'adm-inline-svg': adminlinesvg
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    props: {
        title: {
            type: String,
            default: ''
        },
        closeOverlay: {
            type: Function
        },
        footer: {
            default: false
        },
        history: {
            type: Object,
            default: () => {}
        },
        productType: {
            type: String,
            default: ''
        }
    },
    mounted() {},
    data() {
        return {};
    },
    methods: {}
};
</script>

<style lang="less" scoped>
.overlay {
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    position: fixed;
    z-index: 50;
    top: 64px;
    left: 250px;
    bottom: 0;
    right: 0;
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
}
.download-source-file {
    color: @RoyalBlue;
    &:hover {
        text-decoration: underline;
    }
}
.svg-icons {
    display: inline-flex;
    span {
        cursor: pointer;
        margin-left: 6px;
        ::v-deep svg {
            width: 16px;
            height: 16px;
        }
    }
}
.flex-row {
    display: flex;
    flex-direction: row;
    gap: 10px;
}
.sidebar {
    position: fixed;
    top: 64px;
    right: 0;
    background-color: #ffffff;
    height: 100%;
    width: 40%;
    z-index: 60;
    @media @mobile {
        width: 100%;
    }
    @media @tablet {
        width: 100%;
    }
    &-body {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: calc(100% - 140px);
        overflow-y: auto;
    }
    &-header {
        padding: 18px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 20px;
        color: #41434c;
        font-weight: 600;
        position: relative;
        border-top: 1px solid #e0e0e0;
        &::before {
            content: '';
            position: absolute;
            width: 100%;
            height: 1px;
            left: 0;
            bottom: 0%;
            background-color: #e0e0e0;
        }
    }
}

.close-icon {
    cursor: pointer;
}

.sidebar-body-footer {
    box-shadow: 0px -4px 25px rgba(0, 0, 0, 0.05);
    display: flex;
    justify-content: space-around;
    padding: 16px;
    align-items: center;
    position: absolute;
    bottom: 0;
    right: 0;
    width: 100%;
    // height: 50px;
    .bottom-actions-buttons {
        margin-left: auto;
    }
}
</style>
