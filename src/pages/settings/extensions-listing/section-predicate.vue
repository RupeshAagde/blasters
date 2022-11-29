<template>
    <div>
        <!-- Screen Section -->
        <p class="title cl-Mako bold-sm">Screen Settings</p>
        <div class="screen_opt">
            <span class="title">Mobile ( upto 480px )</span>
            <nitrozen-toggle
                v-model="options.screen.mobile"
            ></nitrozen-toggle>
        </div>
        <div class="screen_opt">
            <span class="title">Tablet ( 481px to 1023px )</span>
            <nitrozen-toggle
                v-model="options.screen.tablet"
            ></nitrozen-toggle>
        </div>
        <div class="screen_opt">
            <span class="title">Desktop( above 1024px )</span>
            <nitrozen-toggle
                v-model="options.screen.desktop"
            ></nitrozen-toggle>
        </div>
    </div>
</template>

<script>
/* Package imports */
import {
    NitrozenToggleBtn
} from '@gofynd/nitrozen-vue';

export default {
    name: 'section-predicate',
    components: {
        'nitrozen-toggle': NitrozenToggleBtn
    },
    data() {
        return {
            options: this.getDefault(),
            config: {}
        }
    },
    methods: {
        getDefault() {
            return {
                screen: {
                    mobile: true,
                    desktop: true,
                    tablet: true
                }
            };
        },
        get() {
            return new Promise((resolve, reject) => {
                if (!this.isFormValid()) {
                    return reject('Form is not Valid');
                }

                resolve({
                    section: this.config.section,
                    options: this.options,
                    index: this.index,
                });
            });
        },
        init(config = {}) {
            this.config = config;
            if (config.section && config.section.predicate) {
                this.options = config.section.predicate;
            }
            this.index = config.index;
        },
        isFormValid() {
            let formValid = true;
            this.scrollToBottom();
            return formValid;
        },
        scrollToBottom() {
            this.$emit('scrollBottom');
        }
    }
}
</script>

<style lang="less" scoped>
.advance-container {
    cursor: pointer;
    color: #9b9b9b;
    margin: 20px 0px;

}
.screen_opt {
    margin: 10px 0px;
    display: flex;
    font-size: 13px;
    align-items: center;

    .title {
        margin: 0px 10px;
    }
}
</style>
