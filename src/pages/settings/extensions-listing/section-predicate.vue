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
            options: {
                screen: {
                    mobile: true,
                    desktop: true
                }
            },
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
