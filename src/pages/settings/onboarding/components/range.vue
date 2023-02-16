<template>
    <div>
        <div class="margin inline apart v-center">
            <div class="inline">
                <div class="cl-Mako dark-xs mr-xs">
                    {{ lineItem.text }}
                </div>
            </div>
            <div class="inline values">
                <nitrozen-input
                    v-model="from"
                    type="number"
                    :class="`cell-value ${fromAlert}`"
                    :placeholder="fromPlaceholder"
                    :disabled="!isEnabled"
                    @change="fromChange"
                />
                <div class="inline v-center">
                    <div class="cl-Mako dark-xs mr-xs">And</div>
                </div>
                <nitrozen-input
                    v-model="to"
                    type="number"
                    :class="`cell-value ${toAlert}`"
                    :placeholder="toPlaceholder"
                    :disabled="!isEnabled"
                    @change="toChange"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { NitrozenInput } from '@gofynd/nitrozen-vue';
import safeAccess from 'safe-access';

export default {
    name: 'range-component',
    components: {
        'nitrozen-input': NitrozenInput
    },
    props: ['lineItem', 'parentState'],
    data() {
        return {
            isEnabled: this.parentState,
            to: this.lineItem.data.to,
            from: this.lineItem.data.from,
            fromPlaceholder:
                safeAccess(this.lineItem, 'additionalParams.fromPlaceholder') ||
                'From',
            toPlaceholder:
                safeAccess(this.lineItem, 'additionalParams.toPlaceholder') ||
                'To',
            minValue:
                safeAccess(this.lineItem, 'additionalParams.minValue') || 0,
            fromAlert: '',
            toAlert: ''
        };
    },
    watch: {
        parentState: function(newVal) {
            this.isEnabled = newVal;
            if (!newVal) {
                this.from = this.lineItem.data.from;
                this.to = this.lineItem.data.to;
            }
        }
    },

    methods: {
        saveForm() {
            if (this.from < this.minValue || this.to < this.minValue) {
                throw new Error('Please fix the Range');
            } else {
                return {
                    from: this.from,
                    to: this.to
                };
            }
        },
        fromChange() {
            if (this.from < this.minValue) {
                this.fromAlert = 'alert';
            } else {
                this.fromAlert = '';
            }
        },
        toChange() {
            if (this.to < this.minValue) {
                this.toAlert = 'alert';
            } else {
                this.toAlert = '';
            }
        }
    }
};
</script>

<style lang="less" scoped>
@import '../../../../pages/less/page-header.less';
@import '../../../../pages/less/page-ui.less';

.margin {
    margin: 8px 24px;
}
.inline {
    display: flex;

    &.apart {
        justify-content: space-between;
    }
    &.v-center {
        align-items: center;
    }
}
.values {
    width: 50%;
}
.cell-value {
    margin: 0px 12px;
    width: 50%;
}

.alert {
    border: 1px solid #f33;
    border-radius: 3px;
}
</style>
