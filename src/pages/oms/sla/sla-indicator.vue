<template>
    <div class="indicator-container">
        <div :class="`indicator-ring ${getLevelAnimationByPercentage}`" :style="`border: 3px solid ${getIndicatorColor};`"/>
        <div class="indicator" :style="`background-color:${getIndicatorColor}`"/>
    </div>
</template>

<script>
/* Helper Imports */
import { getSLAColorByPercent } from './helper.js';

export default {
    name: 'sla-indicator',
    props: {
        sla_percent:{
             type: [String,Number]
        }
    },
    computed:{
        sla_percentage(){
            return this.sla_percent && !isNaN(Number(this.sla_percent))?Number(this.sla_percent):0;
        },
        getIndicatorColor(){
            const details = getSLAColorByPercent(this.sla_percentage);
            return details && details.color ? details.color : "transparent";
        },
        getLevelAnimationByPercentage(){
            // Defines Pulsating Speed
            if(this.sla_percentage<50){
                return 'l1';
            }else if(this.sla_percentage<80){
                return 'l2';
            }else if(this.sla_percentage<100){
                return 'l3';
            }else{
                return 'l4';
            }
        }
    }
}
</script>


<style lang="less" scoped>

.indicator-container {
    position: relative;
    width: 25px;
    height: 25px;
    bottom: 4px;
}

.indicator {
    width: 13px;
    height: 13px;
    background-color: transparent;
    border-radius: 50%;
    position: absolute;
    top: 7px;
    left: 7px;
}

.indicator-ring {
    border: 3px solid transparent;
    -webkit-border-radius: 30px;
    height: 25px;
    width: 25px;
    position: absolute;
    left: -2px;
    top: -2px;
    //-webkit-animation: pulse 2s ease-out;
    //-webkit-animation-iteration-count: infinite; 
    opacity: 0.0
}

.indicator-ring.l1{
    -webkit-animation: pulse 2s ease-out;
    -webkit-animation-iteration-count: infinite; 
}

.indicator-ring.l2{
    -webkit-animation: pulse 1.4s ease-out;
    -webkit-animation-iteration-count: infinite; 

}

.indicator-ring.l3{
    -webkit-animation: pulse 1.2s ease-out;
    -webkit-animation-iteration-count: infinite; 

}

.indicator-ring.l4{
    -webkit-animation: pulse 1s ease-out;
    -webkit-animation-iteration-count: infinite; 
}

@-webkit-keyframes pulse {
    0% {-webkit-transform: scale(0.1, 0.1); opacity: 0.0;}
    50% {opacity: 1.0;}
    100% {-webkit-transform: scale(1.0, 1.0); opacity: 0.0;}
}

</style>
