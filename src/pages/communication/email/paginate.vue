<template>
    <div>
        <select v-model="selected">
            <option>50</option>
            <option>100</option>
            <option>200</option>
        </select>
        <span>Selected: {{ selected }}</span>
    </div>
</template>

<script>
export default {
    data() {
        return {
            selected: '50'
        };
    }
};
</script>

<style lang="less" scoped></style>
