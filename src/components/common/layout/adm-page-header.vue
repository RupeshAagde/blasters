<template>
    <div class="page-header-container">
        <div class="page-header" :class="{'width-100':!showSidebar}">
            <div class="page-nav" :class="{'page-nav-fullscreen':!showSidebar}" :style="fpAppHeaderStyle.headerHeight || {}">
                <div class="back-button-title">
                    <adm-inline-svg
                        class="page-nav-back-text"
                        :src="'arrow-nitrozen'"
                        @click.stop.native="backClick"
                        v-if="showBackButton"
                    />
                    <span
                        class="mobile-icon"
                        v-if="showBackButton"
                        @click="backClick"
                    >
                        <adm-inline-svg src="arrow-dropdown-black"></adm-inline-svg>
                    </span>
                    <div
                        v-if="title"
                        class="page-title"
                        :style="fpAppHeaderStyle.headerTextStyle || {}"
                        :class="{
                            'hide-back-btn': !showBackButton && isMobile
                        }"
                    >
                        {{ title }}
                        <span class="breadcrumb" v-if="breadcrumb">/ {{breadcrumb}}</span>
                    </div>
                </div>
                <div class="page-slot">
                    <slot></slot>
                </div>
                <div class="page-slot-mobile-add" v-show="hasPageMobileAdd">
                    <slot name="page-slot-mobile-add"></slot>
                </div>
                <nitrozen-menu
                    v-if="!noContextMenu"
                    class="menu"
                    :inverted="isMobile"
                    mode="vertical"
                >
                    <nitrozen-menu-item
                        v-for="(item, index) in contextMenuItems"
                        @click.stop="$emit(item.action); $emit('click', item)"
                        :key="index"
                    >
                        {{ item.text }}
                    </nitrozen-menu-item>
                    <nitrozen-menu-item
                        v-if="showContextMenuItemMeta"
                        @click.stop="openMetaDialog('contextItemMeta')"
                    >
                        Meta
                    </nitrozen-menu-item>
                    <nitrozen-menu-item @click.stop="$emit('openHelp')">
                        Help
                    </nitrozen-menu-item>
                    <nitrozen-menu-item v-if="showLogout" @click.stop="$emit('logout')">
                        Logout
                    </nitrozen-menu-item>
                </nitrozen-menu>
            </div>
            <div class="page-slot-mobile" v-show="hasPageNavMobileSlot">
                <slot name="page-slot-mobile"></slot>
            </div>
        </div>
        <div
            class="page-slot-mobile-footer"
            :style="fpAppFooterStyle.footerHeight || {}"
            v-show="hasPageMobileFooter"
        >
            <slot name="page-slot-mobile-footer"></slot>
        </div>
        <adm-meta-dialog
            v-if="showContextMenuItemMeta"
            ref="contextItemMeta"
            :showJsonOnly="showJsonOnly"
            :meta="meta"
            :customJson="customJson"
            @save="save('saveMeta', $event)"
        ></adm-meta-dialog>
    </div>
</template>
<script>
import adminlinesvg from '@/components/common/adm-inline-svg.vue';
import admMetaDialog from '@/components/common/adm-meta-dialog';
import admCustomJsonDialog from '@/components/common/adm-custom-json-dialog';
import { detectFPApp, detectMobile, detectMobileWidth } from '@/helper/utils';
import {
    NitrozenMenu,
    NitrozenMenuItem,
    NitrozenDialog,
    NitrozenButton
} from '@gofynd/nitrozen-vue';

export default {
    name: 'adm-page-header',
    components: {
        'adm-meta-dialog': admMetaDialog,
        'nitrozen-button': NitrozenButton,
        'adm-inline-svg': adminlinesvg,
        'nitrozen-menu': NitrozenMenu,
        'nitrozen-menu-item': NitrozenMenuItem,
        'adm-custom-json-dialog': admCustomJsonDialog
    },
    props: {
        title: {
            type: String,
            default: ''
        },
        contextMenuItems: {
            type: Array,
            default: () => {
                return [];
            }
        },
        showContextMenuItemMeta: {
            type: Boolean,
            default: false
        },
        showSidebar:{
            type: Boolean,
            default: true
        },
        showLogout: {
            type: Boolean,
            default: false
        },
        meta: {
            type: Array
        },
        customJson: {
            type: Object,
            default: () => {
                return {};
            }
        },
        showBackButton: {
            type: Boolean,
            default: true
        },
        noContextMenu: {
            type: Boolean,
            default: false
        },
        showJsonOnly: {
            type: Boolean,
            default: false
        },
        breadcrumb: {
            type: String
        }
    },
    data: function() {
        return {
            showModal: false,
            tags: []
        };
    },
    computed: {
        hasPageNavMobileSlot() {
            return !!this.$slots['page-slot-mobile'];
        },
        hasPageMobileFooter() {
            return !!this.$slots['page-slot-mobile-footer'];
        },
        hasPageMobileAdd() {
            return !!this.$slots['page-slot-mobile-add'];
        },
        isFPApp() {
            return detectFPApp();
        },
        isMobile() {
            return detectMobileWidth();
        },
        fpAppHeaderStyle() {
            if (detectFPApp() && detectFPApp().navigation_bar) {
                let headerHeight = {
                    'min-height': `${detectFPApp().navigation_bar.height ||
                        56.5}px`
                };
                let headerTextStyle = {
                    'font-size': `${detectFPApp().navigation_bar['font-size'] ||
                        18}px`,
                    'text-align': `${detectFPApp().navigation_bar[
                        'title-alignment'
                    ] || 'left'}`,
                    'font-weight': `${detectFPApp().navigation_bar[
                        'font-weight'
                    ] || 'normal'}`,
                    'padding-left': `${detectFPApp().navigation_bar[
                        'text-padding'
                    ] || 0}px`
                };
                return {
                    headerHeight: headerHeight,
                    headerTextStyle: headerTextStyle
                };
            }
            return {};
        },
        fpAppFooterStyle() {
            if (detectFPApp() && detectFPApp().footer) {
                let footerHeight = {
                    height: `${detectFPApp().footer.height || 40}px`,
                    padding: `${Number(detectFPApp().footer.height) - 28 ||
                        16}px`,
                    'padding-bottom': `${Number(detectFPApp().footer.height) -
                        36 || 16}px`
                };
                return {
                    footerHeight: footerHeight
                };
            }
            return {};
        }
    },
    methods: {
        backClick() {
            this.$emit('backClick');
        },
        openMetaDialog(refs) {
            this.$refs[refs].populateData();
            this.$refs[refs].open();
        },
        save(event, meta) {
            this.$emit(event, meta);
        }
    }
};
</script>
<style lang="less" scoped>
.flex{
    display: flex;
}
.page-header-container {
    height: 58.5px;
    .page-slot-mobile-footer {
        display: none;
        padding: 16px;
        position: fixed;
        bottom: 0;
        background-color: @White;
        width: 100%;
        z-index: @dialog;
        border-radius: 3px;
        border: 1px solid @Iron;
        box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.1);
        @media @mobile {
            display: block;
        }
    }
    .page-slot-mobile-add {
        display: none;
        @media @mobile {
            display: flex;
            flex: 1;
            justify-content: flex-end;
            padding-right: 6px;
            ::v-deep svg {
                height: 30px;
                width: 30px;
                #prefix__Rectangle {
                    fill: @RoyalBlue;
                }
                #prefix__Group-5 {
                    stroke: @White;
                }
            }
        }
    }
}
.fp-app-bg-color {
    background-color: @RoyalBlue !important;
}
.width-100{
    width: 100%!important;
}
.back-button-title{
    display: flex;
    margin-left: 24px;
    position: fixed;
    left: 250px;
    @media @mobile{
        align-items: center;
        position: static;
        margin-left: 0px;

    }
}
.page-header {
    background-color: @White;
    display: flex;
    flex-direction: column;
    height: 58.5px; //113px;
    position: fixed;
    width: calc(100% - 250px);
    z-index: @header;
    box-shadow: 0 1px 0px 0 rgba(0, 0, 0, 0.1);
    @media @mobile {
        width: 100%;
        height: auto;
    }
    .page-nav-fullscreen{
        width: 1036px!important;
        margin: 0 auto!important;
        .back-button-title{
            margin-left: 0px!important;
            position: static!important;
        }   
    }
    .page-nav {
        display: flex;
        min-height: 56.5px;
        margin: auto 24px;
        align-items: center;
        @media @mobile {
            .fp-app-bg-color;
        }
        .mobile-icon {
            display: none;
            transform: rotate(90deg);
            padding-bottom: 6px;
            ::v-deep svg {
                height: 42px;
                width: 42px;
                #prefix__Line {
                    stroke: @White;
                }
                #prefix__Line-Copy-4 {
                    stroke: @White;
                }
            }
            @media @mobile {
                display: block;
            }
        }
        @media @mobile {
            margin: 0;
            padding: 0 6px 0 0;
        }
        .page-nav-back-text {
            cursor: pointer;
            margin-right: 18px;
            @media @mobile {
                display: none;
            }
        }
        .page-title {
            color: @Mako;
            font-size: 24px;
            font-weight: bold;
            @media @mobile {
                .fp-app-color;
            }
        }
        .fp-app-color {
            color: @White;
            font-weight: normal;
            font-size: 18px;
            width: 100%;
        }
        .hide-back-btn {
            padding-left: 24px;
        }
        .page-slot {
            display: flex;
            flex: 1;
            justify-content: flex-end;
            @media @mobile {
                display: none;
            }
        }
        .menu {
            margin-left: 8px;
            @media @mobile {
                margin-left: auto;
            }
        }
    }

    // .page-nav-mobile {
    //     display: none;
    //     min-height: 56.5px;
    //     // margin: auto 24px;
    //     padding: 0 24px;
    //     align-items: center;
    //     @media @mobile {
    //         display: none;
    //     }
    //     .page-nav-back-text {
    //         cursor: pointer;
    //         margin-right: 18px;
    //     }
    //     .page-title-mobile {
    //         color: @Mako;
    //         font-size: 24px;
    //         font-weight: bold;
    //     }
    //     .menu-mobile {
    //         margin-left: auto;
    //     }
    // }
    .page-slot-mobile {
        display: none;
        flex: 1;
        // justify-content: space-between;
        border-top: 1px solid @Iron;
        margin-bottom: 16px;
        padding-top: 16px;
        // justify-content: flex-end;
        @media @mobile {
            display: flex;
        }
    }
}
</style>
