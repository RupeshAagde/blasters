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
            :aspectRatio="prop_schema.aspect_ratio || '*'"
            :fileTypes="['png', 'jpeg', 'svg+xml']"
            @save="onChange($event)"
            @delete="mValue = ''"
            v-model="mValue"
            :fileName="`extension image ${Date.now()}`"
            namespace="partner-feature-image"
            :dialogHeight="dialogHeight"
        ></mirage-image-uploader>

        <span class="remove" @click="removeImage" v-if="mValue">
            <adm-inline-svg
                :src="'delete'"
                title="Remove Image"
            ></adm-inline-svg>
        </span>
    </div>
</template>

<script>
import { NitrozenRadio, NitrozenTooltip } from '@gofynd/nitrozen-vue';
import mirageimageuploader from '@/components/common/image-uploader/index.vue';

import AdmInlineSVG from '@/components/common/adm-inline-svg.vue';

export default {
    components: {
        'mirage-image-uploader': mirageimageuploader,
        'nitrozen-tooltip': NitrozenTooltip,
        'nitrozen-radio': NitrozenRadio,
        'adm-inline-svg': AdmInlineSVG
    },
    props: ['prop_schema', 'prop', 'name', 'dialogHeight'],
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
        },
        removeImage(e) {
            this.mValue = '';
            this.$emit('change', {
                type: this.prop_schema.type,
                value: ''
            })
        }
    }
}
</script>

<style lang="less" scoped>
.text-container {
    position: relative;
    padding: 15px 7px;

    .title {
        margin-bottom: 7px;
        display: inline-block;
    }

    .remove {
        position: absolute;
        top: 15px;
        right: 7px;
        cursor: pointer;
    }
}
</style>