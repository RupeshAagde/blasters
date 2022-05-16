<template>
    <div v-click-outside="hideAdd">
        <div
            :class="`available-section-list-item ${index}`"
            @click="select()"
            :id="index + 'available-section-list-item'"
        >
            <img
                class="handle"
                src="/public/admin/assets/admin/pngs/category.png"
            />
            <span class="title">{{ section.label }}</span>
            <nitrozen-button
                v-if="show_add"
                theme="secondary"
                v-flat-btn
                @click="add"
            >
                Add
            </nitrozen-button>
        </div>
    </div>
</template>

<script>
/* Component imports */
import AdmInlineSVG from '@/components/common/adm-inline-svg.vue';

/* Package imports */
import { NitrozenButton, flatBtn } from '@gofynd/nitrozen-vue';

export default {
    name: 'available-section-list-item',
    components: {
        'adm-inline-svg': AdmInlineSVG,
        'nitrozen-button': NitrozenButton
    },
    directives: {
        flatBtn
    },
    props: ['section', 'index'],
    data() {
        return {
            show_add: false
        }
    },
    methods: {
        hideAdd() {
            if (this.show_add) {
                this.$emit('remove_preview');
            }
            this.show_add = false;
        },
        select() {
            if (!this.show_add) {
                this.$emit('select');
            }
            this.show_add = true;
        },
        add() {
            this.$emit('confirm_add');
        }
    }
}
</script>

<style lang="less" scoped>
.available-section-list-item {
    align-items: center;
    display: flex;
    padding: 0px 10px;
    height: 64px;
    box-sizing: border-box;
    cursor: pointer;
    // border-bottom: 1px #dadada solid;
    .handle {
        height: 31px;
        margin-right: 15px;
    }
    .title {
        display: inline-flex;
        align-items: center;
        height: 100%;
        flex: 1;
    }
}
</style>