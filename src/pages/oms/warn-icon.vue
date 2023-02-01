<template>
    <div class="warn-icon">
        <div class="inner-icon">
            <div class="inner-circle"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'warn-icon'
}
</script>

<style lang="less" scoped>
.warn-icon {
    background: linear-gradient(180deg, #E9783D -16.67%, #E4E4E4 175%);
    padding: 2px;
    position: relative;
    border-radius: 50%;
    margin-right: 4px;
    display: flex;
    justify-content: center;
    align-items: center;

    .inner-icon {
        width: 16px;
        height: 16px;
        background: #FFFFFF;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;

        .inner-circle {
            background: #E9783D;
            width: 10px;
            border-radius: 50%;
            height: 10px;
        }
    }
}
</style>
