<template>
    <div class="panel">
        <page-header
            title="General Configuration"
            @backClick="
                $router.push({
                    path: '/administrator/support/category-listing',
                })
            "
        >
        </page-header>
        <div class="container">
            <div class="input">
                <div class="field">
                    <nitrozen-input
                        class="number-input"
                        v-model="phoneNumber"
                        label="Phone Number *"
                        type="number"
                    ></nitrozen-input>
                    <nitrozen-input
                        class="email-input"
                        v-model="email"
                        label="Email *"
                    ></nitrozen-input>
                </div>
            </div>
            <div class="toggle-container">
                <div class="show-toggle">
                    <label class="label-text"> Show Contact Info </label>
                    <nitrozen-toggle-btn v-model="show"></nitrozen-toggle-btn>
                </div>
                <div class="show-toggle">
                    <label class="label-text"> Show Ticket Listing </label>
                    <nitrozen-toggle-btn v-model="show1"></nitrozen-toggle-btn>
                </div>
                <div class="show-toggle">
                    <label class="label-text"> Show Ticket creation </label>
                    <nitrozen-toggle-btn v-model="show2"></nitrozen-toggle-btn>
                </div>
            </div>
            <div class="btn-container">
                <nitrozen-button
                    class="save-tags-btn"
                    v-flat-btn
                    :rounded="false"
                    :theme="'secondary'"
                    @click="save()"
                >
                    Save
                </nitrozen-button>
            </div>
        </div>
    </div>
</template>
<script>
import {
    NitrozenButton,
    NitrozenInput,
    NitrozenToggleBtn,
} from '@gofynd/nitrozen-vue';
import { PageHeader } from '@/components/common';
export default {
    name: 'general-Configuration',
    components: {
        NitrozenButton,
        PageHeader,
        'nitrozen-toggle-btn': NitrozenToggleBtn,
        'nitrozen-input': NitrozenInput,
    },
    data() {
        return {
            phoneNumber: '',
            email: '',
            show: '',
            show1: '',
            show2: '',
        };
    },
    methods: {
        save() {
            console.log('>>save');
        },
    },
};
</script>
<style lang="less" scoped>
.panel {
    display: flex;
    flex-direction: column;
}
.container {
    position: relative;
    background-color: white;
    margin: 24px;
    padding: 0px 24px 24px;
    top: 56.5px;
}
.input {
    position: relative;
    margin-top: 16px;
}
.number-input {
    width: 160px;
}
.email-input {
    width: 330px;
    margin-left: 24px;
}
.field {
    display: flex;
}
.btn-container {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
}
.toggle-container {
    display: flex;
    margin-top: 16px;
    justify-content: space-around;
}
.label-text {
    padding: 6px;
}
.show-toggle {
    display: flex;
}
</style>
