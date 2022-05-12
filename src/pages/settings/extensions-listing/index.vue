<template>
    <div>
        <no-ssr>
            <div class="container"></div>
        </no-ssr>
    </div>
</template>

<script>
/* Package imports */
import NoSSR from 'vue-no-ssr';

export default {
    name: 'extensions-listing',
    components: {
        'no-ssr': NoSSR
    }
}
</script>

<style lang="less" scoped>
.container {
    flex: 1;
    display: flex;
    font-family: Inter !important;

    button,
    input,
    textarea,
    select {
        font-family: Inter !important;
    }

    ::placeholder {
        font-family: Inter !important;    
    }
}
</style>
