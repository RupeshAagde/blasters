<template>
    <div class="panel">
        <div class="main-container">
            <div class="jumbotron-container">
                <jumbotron
                    :title="'Settings'"
                    :desc="'Add or edit configurations'"
                ></jumbotron>
            </div>
            <section>
                <div class="settings-head">
                    <inline-svg src="settings"></inline-svg>
                    <span class="bold-xs cl-Mako title">General</span>
                </div>

                <div class="settings-main">
                    <span
                        class="settings-menu"
                        v-for="(menu, index) in general_menus"
                        :key="'general' + index"
                    >
                        <router-link :to="menu.link">
                            <div class="settings-body" @click="$emit('click')">
                                <span class="settings-icon">
                                    <inline-svg
                                        v-if="menu.icon"
                                        :src="menu.icon"
                                        class="feature-icon"
                                    ></inline-svg>
                                </span>
                                <span class="settings-content">
                                    <div>
                                        <span class="bold-xs cl-Mako">{{
                                            menu.title
                                        }}</span>
                                    </div>
                                    <div class="settings-detail">
                                        <span class="cl-Mako">
                                            {{
                                                menu.desc ||
                                                    'View and Update store details'
                                            }}
                                        </span>
                                    </div>
                                </span>
                            </div>
                        </router-link>
                    </span>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
import Jumbotron from '@/components/common/jumbotron';
import { titleCase, debounce } from '@/helper/utils';
import InlineSvg from '@/components/common/inline-svg';
import {
    NitrozenButton,
    NitrozenDropdown,
    strokeBtn,
    flatBtn,
    NitrozenBadge
} from '@gofynd/nitrozen-vue';
import _ from 'lodash';

const GENERAL_MENUS = [
    {
        title: 'Basic',
        link: 'settings/basic',
        icon: 'settings',
        permissions: [],
        active: false,
        desc: 'Update basic platform information'
    },
    {
        title: 'Features',
        link: 'settings/features',
        icon: 'settings',
        permissions: [],
        active: false,
        desc: 'Change platform features information'
    },
    {
        title: 'Navbar',
        link: 'settings/navbar',
        icon: 'settings',
        permissions: [],
        active: false,
        desc: 'Change platform navbar'
    }
];
export default {
    name: 'settings',
    components: {
        InlineSvg,
        NitrozenBadge,
        NitrozenDropdown,
        NitrozenButton,
        Jumbotron
    },
    directives: {
        strokeBtn,
        flatBtn
    },
    data() {
        return {
            pageLoading: false,
            pageError: false,

            general_menus: GENERAL_MENUS
        };
    },
    mounted() {},
    methods: {
        titleCase
    }
};
</script>

<style lang="less" scoped>
.panel {
    display: flex;
    flex-direction: column;
}
.main-container {
    cursor: pointer;
    background-color: white;
    margin: 24px;
    padding: 24px;
    position: relative;
    min-height: 400px;
    section {
        margin-top: 24px;
        .settings-head {
            display: flex;
            align-items: center;
            .title {
                font-size: 18px;
                padding-left: 10px;
            }
        }
        .settings-main {
            display: flex;
            flex-wrap: wrap;
            .settings-menu {
                flex: 0 33.3%;
            }
            .settings-body {
                border: 1px solid @Iron;
                border-radius: 3px;
                display: flex;
                cursor: pointer;
                margin: 24px 24px 0 0;
                min-height: 84px;
                &:hover {
                    box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, 0.1);
                }
                .settings-icon {
                    width: 30%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-right: 1px solid @Alabaster2;
                    background-color: @Alabaster2;
                    img {
                        width: auto;
                    }
                }
                .settings-content {
                    background-color: @White;
                    width: 70%;
                    padding: 12px;
                    .settings-detail {
                        padding-top: 6px;
                        font-size: 12px;
                        line-height: 1.5;
                    }
                }
            }
        }
    }
}
</style>
