<template>
    <!-- bulk import  -->
    <nitrozen-dialog class="dialog" ref="grpDialog" title="Group & Sequence">
        <template slot="body">
            <div class="settings-main">
                <span
                    class="settings-menu"
                    v-for="(menu, index) in menus"
                    :key="'general' + index"
                >
                    <card @click="close(menu.action)">
                        <span class="settings-icon">
                            <inline-svg
                                v-if="menu.icon"
                                :src="menu.icon"
                                class="feature-icon"
                            ></inline-svg>
                        </span>
                        <span class="settings-content">
                            <div>
                                <span class="bold-xs cl-Mako">
                                    {{ menu.title }}
                                </span>
                            </div>
                            <div class="settings-detail">
                                <span class="cl-Mako">
                                    {{ menu.desc }}
                                </span>
                            </div>
                        </span>
                    </card>
                </span>
            </div>
        </template>
    </nitrozen-dialog>
</template>

<script>
import {
    NitrozenButton,
    NitrozenDialog,
    flatBtn,
    strokeBtn
} from '@gofynd/nitrozen-vue';
import Card from '@/components/common/layout/card.vue';
import InlineSvg from '@/components/common/inline-svg.vue';

const MENUS = [
    {
        title: 'Detail',
        action: 'detail',
        icon: 'details',
        permissions: ['catalogue'],
        active: false,
        desc: 'Group and sequence attributes for Product details page'
    },
    {
        title: 'Compare',
        action: 'compare',
        icon: 'compare',
        permissions: ['catalogue'],
        active: false,
        desc: 'Group and sequence attributes for Product comparison section'
    },
    {
        title: 'Filter',
        action: 'filter',
        icon: 'filterv2',
        permissions: ['catalogue'],
        active: false,
        desc: 'Sequence Product filter attributes for Product listing page'
    }
];
export default {
    name: 'GroupAndOrderDialog',
    components: {
        NitrozenButton,
        NitrozenDialog,
        Card,
        InlineSvg
    },
    props: {},
    directives: {
        flatBtn,
        strokeBtn
    },
    computed: {},
    data: function() {
        return { menus: MENUS };
    },
    mounted() {},
    methods: {
        open() {
            this.$refs.grpDialog.open({
                showCloseButton: true,
                positiveButtonLabel: false,
                negativeButtonLabel: false,
                neutralButtonLabel: false,
                width: '800px'
            });
        },
        close(entity) {
            this.$refs.grpDialog.close(entity);
            this.$emit('close', entity);
        }
    }
};
</script>

<style lang="less" scoped>
.dialog {
    ::v-deep .nitrozen-dialog {
        .nitrozen-dialog-body {
            overflow: unset;

            .settings-main {
                display: flex;
                justify-content: space-between;
                .settings-menu {
                    flex: 1;
                    margin: 0 12px;
                    .settings-body {
                        margin: 0;
                        flex-direction: column;
                        height: auto;
                    }
                }
                .settings-icon {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-right: 1px solid @Alabaster2;
                    background-color: @Alabaster2;
                    padding: 24px;
                    .feature-icon {
                        svg {
                            width: 50px;
                            height: 50px;
                        }
                    }
                    img {
                        width: auto;
                    }
                }
                .settings-content {
                    background-color: @White;
                    padding: 12px;
                    .settings-detail {
                        padding-top: 6px;
                        font-size: 12px;
                        line-height: 1.5;
                    }
                }
            }
        }
        .nitrozen-dialog-footer {
            margin-bottom: 0;
            height: 12px;
        }
    }
}
</style>
