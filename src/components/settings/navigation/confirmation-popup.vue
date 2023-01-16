<template>
    <nitrozen-dialog ref="dialog" >
        <template slot="body">
            <div class="container">
                <div class="header-svg"> 
                    <inline-svg :src="'warning-yallow'"> </inline-svg> 
                </div>
                <div class="header"> {{ header }}</div>
                <div class="info"> {{ info }}</div>
            </div>
        </template>
        <template slot="footer">
            <div class="footer">
                <nitrozen-button
                    class="footer-btn"
                    :theme="'secondary'"
                    @click="save(false)"
                    v-strokeBtn
                    > {{ cancleButtonName }} </nitrozen-button>

                <nitrozen-button
                    class="footer-btn"
                    :theme="'secondary'"
                    @click="save(true)"
                    v-flatBtn
                    > {{ confirmButtonName }} </nitrozen-button>
            </div>
        </template>
    </nitrozen-dialog>
</template>

<script>


import {
    NitrozenDialog,
    NitrozenInput,
    NitrozenButton,
    NitrozenError,
    strokeBtn,
    flatBtn
} from '@gofynd/nitrozen-vue';
import { InlineSvg } from '@/components/common/';
export default {
    name: 'edit-header',
    components: {
        NitrozenButton,
        NitrozenDialog,
        "nitrozen-input": NitrozenInput,
        'nitrozen-error': NitrozenError,
        'inline-svg': InlineSvg,
    },
    directives: {
        strokeBtn,
        flatBtn
    },
    mounted() {
        
    },
    data() {
        return {
            header: '',
            info: '',
            confirmButtonName: '',
            cancleButtonName: ''
        }
    },
    methods: {
        open(popupInfo) {
            this.header = popupInfo.header
            this.info = popupInfo.info
            this.confirmButtonName = popupInfo.confirmButtonName
            this.cancleButtonName = popupInfo.cancleButtonName
            this.$refs["dialog"].open({
                width: "600px",
                showCloseButton: false,
            });
        },
        save(isSave) {
            if(isSave)
                this.$emit('onUpdate')

            this.$refs['dialog'].close();
        }
    }
};
</script>

<style lang="less" scoped>
    .container{
        margin: 40px;
        .header {
            font-weight: 600;
            font-size: 18px;
            margin-top: 14px;
        }
        .info {
            font-weight: 400;
            font-size: 15px;
            margin-top: 14px;
        }
    }
</style>
