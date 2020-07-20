<template>
    <div class="page-header">
        <div class="page-nav">
            <inline-svg
                class="page-nav-back-text"
                :src="'arrow-nitrozen'"
                @click.stop.native="backClick"
                v-if="showBackButton"
            />
            <div v-if="title" class="page-title">{{ title }}</div>
            <div class="page-slot">
                <slot></slot>
            </div>
            <nitrozen-menu class="menu" mode="vertical">
                <nitrozen-menu-item
                    v-for="(item, index) in contextMenuItems"
                    @click="$emit(item.action)"
                    :key="index"
                    >{{ item.text }}</nitrozen-menu-item
                >
                <nitrozen-menu-item
                    v-if="showContextMenuItemMeta"
                    @click="openMetaDialog('contextItemMeta')"
                    >Meta</nitrozen-menu-item
                >
                <!-- <nitrozen-menu-item
                    v-if="showContextMenuItemMeta"
                    @click="openMetaDialog('contextItemCustomJson')"
                    >JSON</nitrozen-menu-item
                >-->
                <nitrozen-menu-item @click="$root.$emit('openHelp')"
                    >Help</nitrozen-menu-item
                >
            </nitrozen-menu>
        </div>
        <meta-dialog
            v-if="showContextMenuItemMeta"
            ref="contextItemMeta"
            :meta="meta"
            :customJson="customJson"
            @save="save('saveMeta', $event)"
        ></meta-dialog>
        <!-- <custom-json-dialog
            ref="contextItemCustomJson"
            :customJson="customJson"
            @save="save('saveCustomJson', $event)"
    ></custom-json-dialog>-->
    </div>
</template>
<script>
import InlineSvg from '@/components/common/inline-svg.vue';
import MetaDialog from '@/components/common/meta-dialog';
import CustomJsonDialog from '@/components/common/custom-json-dialog';

import {
    NitrozenMenu,
    NitrozenMenuItem,
    NitrozenDialog,
    NitrozenButton
} from '@gofynd/nitrozen-vue';

export default {
    name: 'page-header',
    components: {
        MetaDialog,
        NitrozenButton,
        InlineSvg,
        NitrozenMenu,
        NitrozenMenuItem,
        CustomJsonDialog
    },
    props: {
        title: {
            type: String,
            default: 'Page Title'
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
        }
    },
    data: function() {
        return {
            showModal: false,
            tags: []
        };
    },
    computed: {},
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
.page-header {
    background-color: #fff;
    display: flex;
    flex-direction: column;
    height: 58.5px; //113px;
    position: fixed;
    width: calc(100% - 250px);
    z-index: @header;
    box-shadow: 0 1px 0px 0 rgba(0, 0, 0, 0.1);
    .page-nav {
        display: flex;
        min-height: 56.5px;
        margin: auto 24px;
        align-items: center;
        .page-nav-back-text {
            cursor: pointer;
            margin-right: 18px;
        }
    }
    .page-title {
        color: @Mako;
        font-size: 24px;
        font-weight: bold;
    }
    .page-slot {
        display: flex;
        flex: 1;
        justify-content: flex-end;
    }
    .menu {
        margin-left: 8px;
    }
}
</style>
