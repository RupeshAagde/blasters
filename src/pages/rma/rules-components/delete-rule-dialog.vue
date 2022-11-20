<template>
    <nitrozen-dialog ref="delete-rule-dialog" class="delete-channel-dialog">
        <template slot="body">
            <div class="dialog-body">
                <img src='/public/assets/svgs/yellow-alert-badge.svg'/>
                <div class="heading">Are you sure?</div>
                <div class="description">Upon deletion, this rule will not work if it has been enabled in any sales channel</div>
            </div>
        </template>
        <template slot="footer">
            <div class="dialog-footer">
                <nitrozen-button
                    theme="secondary"       
                    @click="$emit('onNo')"
                    v-strokeBtn
                    >No
                </nitrozen-button>
                <nitrozen-button
                    theme="secondary"
                    @click="$emit('onYes')"
                    v-flatBtn
                    >Yes
                </nitrozen-button>
            </div>
        </template>
    </nitrozen-dialog>
</template>

<script>
    import {    
        NitrozenDialog,
        NitrozenButton,
        flatBtn,
        strokeBtn
    } from '@gofynd/nitrozen-vue';

    export default{
        name: 'rule-delete-dialog',
        components: {
            'nitrozen-dialog': NitrozenDialog,
            'nitrozen-button': NitrozenButton
        },
        directives: {
            flatBtn,
            strokeBtn
        },
        methods:{
            open(){
                this.$refs['delete-rule-dialog'].open({
                    neutralButtonLabel: false,
                    width: '383px'
                });
            },
            close(){
                this.$refs['delete-rule-dialog'].close();
            }
        }
    }
</script>

<style scoped lang="less">
.nitrozen-dialog{
    border-radius: 12px;
    .dialog-body{
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 40px;
        padding-inline: 16px;
    
        img{
            width: 50px;
            margin-bottom: 16px;
        }
    
        .heading{
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 12px;
        }

        .description{
            font-size: 12px;
            font-weight: 400;
            color: #666666;
        }
    }
}
</style>