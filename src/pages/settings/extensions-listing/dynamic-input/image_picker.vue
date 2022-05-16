<template>
    <div class="text-container">
        <span class="title">
            {{ prop_schema.label }}
            <span>
                <nitrozen-tooltip :position="'bottom'" v-if="prop_schema.info">
                    <span class="desc">{{ prop_schema.info }}</span>
                </nitrozen-tooltip>
            </span>
        </span>

        <mirage-image-uploader
            aspectRatio="*"
            :fileTypes="['png', 'jpeg', 'svg+xml']"
            @save="onChange($event)"
            @delete="mValue = ''"
            v-model="mValue"
            :fileName="`theme image ${Date.now()}`"
            namespace="application-theme-images"
        ></mirage-image-uploader>
    </div>
</template>

<script>
import { NitrozenRadio, NitrozenTooltip } from '@gofynd/nitrozen-vue';
import mirageimageuploader from '@/components/common/image-uploader/index.vue';

export default {
    components: {
        'mirage-image-uploader': mirageimageuploader,
        'nitrozen-tooltip': NitrozenTooltip,
        'nitrozen-radio': NitrozenRadio
    },
    props: ['prop_schema', 'prop', 'name'],
    mounted() {
        this.mValue = this.prop.value || this.prop_schema.default || '';
    },
    watch: {
        prop: {
            deep: true,
            handler() {
                this.mValue = this.prop.value;
            }
        }
    },
    data() {
        return {
            mValue: ''
        };
    },
    methods: {
        onChange(e) {
            this.$emit('change', {
                type: this.prop_schema.type,
                value: e
            });
        }
    }
}
</script>

<style lang="less" scoped>
.text-container {
    .title {
        margin-bottom: 7px;
        display: inline-block;
    }
    padding: 15px 7px;
}
</style>