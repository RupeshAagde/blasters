<template>
 
   

</template>

<script>
/* Package imports */
import isEmpty from 'lodash/isEmpty';


/* Component imports */


/* Helper imports */


export default {
    name: 'bag-row-item',
    components: {
       
    },
    props: {
        
    },
    data() {
        return {
            imageView: false,
            imageData: [],
        }
    },
    mounted() {
    },
    methods: {
        openImage(item_details) {
            this.imageView = !this.imageView;
            this.imageData = item_details;
        },
         snakeCaseToCaps(text) {
            return convertSnakeCaseToString(text).toUpperCase();
        }     
    }
}
</script>

<style lang="less" scoped>
   

   
</style>
