<template>
    <div class="oops-error light-xxs">
        <div>{{ text }}</div>
    </div>
</template>

<style lang="less" scoped>
.oops-error {
    background-color: #faebed;
    margin-bottom: 0px;
    padding: 10px 5px;
    margin-left: 0px;
    margin-right: 0px;
    animation: fadeIn 0.5s ease;
}
</style>

<script>
export default {
    name: 'ukt-oops',
    props: {
        text: {
            type: String
        }
    }
};
</script>
