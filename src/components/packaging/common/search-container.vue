<template>
    <div class="search-box-container">
        <nitrozen-input
            class="search-box-input"
            :id="id"
            :placeholder="placeholder"
            :showSearchIcon="true"
            @input="handleChange"
        />
    </div>
</template>

<script>
import { NitrozenInput } from '@gofynd/nitrozen-vue';
export default {
    name: 'search-container',
    components: {
        NitrozenInput
    },
    props: {
        id: {
            type: Number
        },
        placeholder: {
            type: String
        },
        handleChange: {
            type: Function
        }
    }
};
</script>

<style lang="less">
@import '../../../less/packaging/search-container.less';
</style>
