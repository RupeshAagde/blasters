<template>
    <div class="page-container">
        <div class="cl-Mako bold-md top-headers">Details</div>
        <div class="form-row">
            <div class="form-item">
                <nitrozen-input
                    :label="'Name *'"
                    v-model="formData.plan.name"
                ></nitrozen-input>
                <nitrozen-error v-bind:class="{ visible: errors['name'] }">{{
                    errors['name'] || '-'
                }}</nitrozen-error>
            </div>
        </div>

        <div class="form-row">
            <div class="form-item">
                <nitrozen-input
                    :label="'Description'"
                    v-model="formData.plan.description"
                ></nitrozen-input>
                <nitrozen-error v-bind:class="{ visible: errors['desc'] }">{{
                    errors['desc'] || '-'
                }}</nitrozen-error>
            </div>
        </div>

        <div class="form-row">
            <div class="form-item">
                <tags-input v-model="formData.plan.tags"></tags-input>
                <nitrozen-error>-</nitrozen-error>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped></style>

<script>
import {
    NitrozenInput,
    NitrozenError,
    NitrozenDropdown,
    NitrozenCheckBox,
    NitrozenChips,
    NitrozenInline
} from '@gofynd/nitrozen-vue';

import { TagsInput } from '../../../components/common';

export default {
    name: 'detail-section',
    components: {
        'nitrozen-input': NitrozenInput,
        'nitrozen-error': NitrozenError,
        'nitrozen-dropdown': NitrozenDropdown,
        'nitrozen-checkbox': NitrozenCheckBox,
        'nitrozen-chip': NitrozenChips,
        'tags-input': TagsInput
    },
    props: {
        formData: {
            type: Object
        },
        errors: {
            type: Object
        }
    }
};
</script>
