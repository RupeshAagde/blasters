<template>
    <div class="store-info-container" v-if="store_info && store_info.length">
        <div
            class="store-info"
            v-for="(info, index) in store_info"
            :key="index"
        >
            <span class="sub-heading" v-if="emptyCheck(info.value)"> <span class="title-background">{{ info.display_name }}</span>: </span>{{ info.value }}
        </div>
    </div>
</template>

<script>
import isEmpty from 'lodash/isEmpty';
export default {
    name: 'order-store-info',
    props: {
        store_info: {
         type: Array
        }
    },
     methods:{
        emptyCheck(val){
            if(typeof val === 'number' && val !== undefined) return val;
            else return !isEmpty(val);
        }
     }
}
</script>

<style lang="less" scoped>
.store-info-container {
    .store-info {
        font-size: 14px;
        line-height: 22px;
        word-break: break-word;
        
        .sub-heading{
            .title-background{
             color: #9B9B9B;
            }
        }
    }
}
</style>
