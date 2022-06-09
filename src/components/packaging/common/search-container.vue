<template>
    <div class="search-box-container">
        <nitrozen-input
            :id="id"
            class="search-box-input"
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
            type: String
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
