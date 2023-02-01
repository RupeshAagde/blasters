<template>
    <transition name="slide">
        <div v-if="show" class="available-sections-container">
            <span class="close-btn" @click="onClose($event)">
                <adm-inline-svg class="remove-section" :src="'cross-black'" />
            </span>
            <div
                class="available-sections-list"
                v-for="(section, i) in available_sections"
                :key="i"
            >
                <available-section-list-item
                    :index="i"
                    :section="section"
                    @select="onSectionClick(section)"
                    @confirm_add="onAddSection(section)"
                    @remove_preview="onRemovePreview(section)"
                />
            </div>
        </div>
    </transition>
</template>

<script>
/* Component imports */
import AvailableSectionListItem from './available-section-list-item.vue';
import AdmInlineSVG from '@/components/common/adm-inline-svg.vue';

export default {
    name: 'available-sections-list',
    props: ['available_sections', 'page', 'show'],
    components: {
        'adm-inline-svg': AdmInlineSVG,
        'available-section-list-item': AvailableSectionListItem
    },
    methods: {
        onSectionClick(section) {
            this.$emit('select', section);
        },
        onAddSection(section) {
            this.$emit('add-section', section);
        },
        onRemovePreview(section) {
            this.$emit('remove_preview');
        },
        onClose() {
            this.$emit('close');
        }
    }
}
</script>

<style lang="less" scoped>
.available-sections-container {
    height: calc(100% - 110px);
    position: absolute;
    background: #f8f8f8;
    padding: 50px 0;
    width: 100%;
    z-index: 1;
    overflow: hidden;
    overflow-y: scroll;
    .close-btn {
        position: absolute;
        right: 10px;
        top: 10px;
        display: inline-block;
        cursor: pointer;
    }
    .available-sections-list {
        border-top: 1px #dadada solid;
    }
}

.slide-leave-active,
.slide-enter-active {
    transition: 0.3s;
}
.slide-enter {
    transform: translate(-100%, 0%);
}
.slide-leave-to {
    transform: translate(-100%, 0%);
}
/deep/.n-flat-button {
    width: 60px;
    padding: 0 10px;
    .n-button-content {
        justify-content: center;
        font-weight: normal;
        font-size: 14px;
    }
}
</style>