<template>
    <div class="breadcrumb-container">
        <div 
            class="link"
            v-for="(route, index) in routes"
            :key="index"
        >
            <span :class="{'text': true, 'active': index === routes.length - 1}" @click="redirectTo(index, route)">
                {{route.name}}
            </span>
            <ukt-inline-svg
                v-if="index < routes.length - 1"
                src="arrow-right-black"
                class="arrow"
            />
        </div>
    </div>
</template>

<script>
import UktInlineSvg from '@/components/common/ukt-inline-svg.vue';
export default {
    name: 'breadcrumb',
    props: {
        routes: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        redirectTo(index, route){
            if (index < this.routes.length - 1)
            this.$router.push({ path: route.path});
        }
    },
    components:{
        UktInlineSvg,
    }
}
</script>

<style lang="less" scoped>
    .breadcrumb-container{
        display: flex;
        align-items: center;
        gap: 8px;

        .link{
            display: flex;
            align-items: center;
            gap: 8px;
            color: @DustyGray2;

            .arrow{
                height: 18px;
                width: 18px;
            }

            .text{
                font-size: 12px;
                cursor: pointer;
                font-weight: 400;

                &.active{
                    color: @Mako;
                    font-weight: 600;
                }
            }
        }
    }
</style>