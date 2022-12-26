<template>
    <div>
        <div class="main-container provider-container">
            <div class="label">{{ label }}</div>
            <div class="providers">
                <div
                    v-for="(p, i) in providers"
                    :class="[
                        'provider',
                        i === selectedIndex ? 'selected' : 'not-selected',
                    ]"
                    :key="i"
                    @click="providerClick(i, p)"
                    :title="p.name"
                >
                    <adm-inline-svg :src="p.image" :title="p.name" />
                    <span class="provider-name">{{ p.name }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
::v-deep .nitrozen-tab-container {
    margin-top: 24px;
}
.label {
    color: #9b9b9b;
    font-family: Inter, sans-serif;
    font-size: 12px;
    font-weight: 500;
    line-height: 21px;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
}
.providers {
    display: flex;
    padding-bottom: 24px;
    flex-wrap: wrap;
    flex: 0 100%;
    @media @mobile {
        padding: 0;
    }
    .provider {
        width: 88px;
        height: 128px;
        margin: 12px;
        padding: 12px;
        border-radius: 4px;
        border: 1px solid @Iron;
        @media @mobile {
            width: 100%;
            display: flex;
            align-items: center;
            height: initial;
        }
        cursor: pointer;
        &:hover {
            box-shadow: 0 9px 13px 0 rgba(221, 221, 221, 0.5);
        }
        img {
            width: 88px;
            height: 88px;
        }
        .provider-name {
            display: inline-block;
            width: 88px;
            text-align: center;
            padding-top: 6px;
        }
    }
    .selected {
        border: 1px solid #5443bf;
    }
    .not-selected {
        border: 1px solid rgba(0, 0, 0, 0);
        color: #9b9b9b;
    }
}
</style>

<script>
import { NitrozenTab } from '@gofynd/nitrozen-vue';
import loader from '@/components/common/loader.vue';
import pageerror from '@/components/common/page-error.vue';
import admJumbotron from '@/components/common/jumbotron.vue';
import admInlineSVG from '@/components/common/inline-svg';

import { mapGetters } from 'vuex';
import root from 'window-or-global';
const config = root.config || {};

export default {
    components: {
        'nitrozen-tab': NitrozenTab,
        loader: loader,
        'page-error': pageerror,
        'adm-jumbotron': admJumbotron,
        'adm-inline-svg': admInlineSVG,
    },

    data() {
        return {
            ON_PROVIDER_CHANGE: 'onProviderChange'
        };
    },
    props: {
        providers: {
            type: Array,
            default: () => [],
        },
        label: {
            type: String,
            default: 'Please select a provider',
        },
        selectedIndex: {
            type: Number,
            default: -1
        }
    },
    methods: {
        providerClick(i, p) {     
            this.$emit(this.ON_PROVIDER_CHANGE, i);
        },
    },
};
</script>
