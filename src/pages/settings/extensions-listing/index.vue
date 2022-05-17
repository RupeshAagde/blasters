<template>
    <div>
        <no-ssr>
            <div class="container">
                <container />
            </div>
        </no-ssr>
    </div>
</template>

<script>
/* Package imports */
import NoSSR from 'vue-no-ssr';
import Container from './container.vue';

export default {
    name: 'extensions-listing',
    mounted() {
        console.log("Here");
    },
    components: {
        'no-ssr': NoSSR,
        'container': Container
    }
}
</script>

<style lang="less">
#app {
    height: 100%;
    .section-content {
        height: 100%;
        
        > div {
            height: 100%;
            display: flex;
            flex-direction: column;
        }
    }
}
</style>

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
