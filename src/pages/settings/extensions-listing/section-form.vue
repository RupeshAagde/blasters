<template>
    <transition name="slide">
        <div
            v-if="show && section_schema && section_schema.props" 
            class="section-form-container">
            <div class="header">
                <adm-inline-svg
                    class="back-btn"
                    :src="'arrow-nitrozen'"
                    @click.stop.native="onCloseClick($event)"
                />
                <h3 class="title">{{section_schema.label}}</h3>
            </div>
        </div>

        <div class="form-body nitrozen-scrollbar">
            <h2 class="heading">Settings</h2>
            <div class="settings-form">

            </div>
        </div>
    </transition>
</template>

<script>
/* Component imports */
import AdmInlineSVG from '@/components/common/adm-inline-svg.vue';

export default {
    name: 'section-form',
    components: {
        'adm-inline-svg': AdmInlineSVG
    }
}
</script>

<style lang="less" scoped>

</style>
