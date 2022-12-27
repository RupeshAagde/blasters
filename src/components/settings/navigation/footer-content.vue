<template>
    <div class="company">
        <div class="company-title">
            <div class="company-menu">
                Footer Content
            </div>
            <div class="grp-btn-close">
                <div class="add-menu-btn">
                    <nitrozen-toggle-btn> </nitrozen-toggle-btn>
                </div>
            </div>
        </div> 
        <hr class="line">
        <div class="form-grp">
            <div class="input">
                <div class="intput-des">
                    <div> Line 1 </div>
                    <div> 21/36</div>
                </div>
                <div>
                    <nitrozen-input type="text"></nitrozen-input>
                </div>
            </div>
            <div class="input">
                <div class="intput-des">
                    <div> Line 2 </div>
                    <div> 21/36</div>
                </div>
                <div>
                    <nitrozen-input type="text"></nitrozen-input>
                </div>
            </div>
        </div>
    </div>
    
</template>

<script>


import {
    NitrozenButton,
    NitrozenToggleBtn,
    NitrozenInput
} from '@gofynd/nitrozen-vue';

export default {
    name: 'footer-content',
    components: {
        NitrozenButton,
        'nitrozen-toggle-btn': NitrozenToggleBtn,
        "nitrozen-input": NitrozenInput,
    }
};
</script>

<style lang="less" scoped>
    .company {
        border: 1px solid #E4E5E6;
        border-radius: 3px;
        margin-top: 22px;
        .company-title {
            
            display: flex;
            align-content: center;
            align-items: center;
            justify-content: space-between;
            height: 71px;
            padding: 0px 20px 0px 20px;
            .company-menu {
                font-weight: 600;
                font-size: 18px;
            }
        }
        .intput-des {
            display: flex;
            font-weight: 400;
            font-size: 12px;
            color: #9B9B9B;
            justify-content: space-between;
            margin-bottom: 5px;
        }
        .input {
            margin: 20px 20px 20px 20px;;
        }
        .line {
            border: 0.5px solid #E4E5E6;
            margin: 0px;
        }

    }
</style>
