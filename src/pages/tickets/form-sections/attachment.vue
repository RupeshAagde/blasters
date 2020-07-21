<template>
    <div class="main">
        <div>
            <div v-if="attachment.type == 'image'" class="product">
                <div class="side-image">
                    <img :src="attachment.value" />
                </div>
                <div class="card-content-section">
                    <div class="card-content-line-1">
                        {{ attachment.display || attachment.value }}
                    </div>
                </div>
            </div>
            <a
                v-else-if="attachment.type == 'product'"
                class="product"
                :href="urlToOpen"
                target="_blank"
            >
                <div class="side-image" v-if="attachment.details">
                    <img :src="attachment.details.images[0].url" />
                </div>
                <div v-if="attachment.details" class="card-content-section">
                    <div class="card-content-line-1">
                        {{ attachment.details.name }}
                    </div>
                    <div class="card-content-line-2">
                        {{ attachment.details.brand.name }}
                    </div>
                </div>
                <div v-else>
                    {{ attachment.display || attachment.value }}
                </div>
            </a>
        </div>
        <div class="cross-container">
            <nitrozen-inline
                icon="cross"
                class="nitrozen-icon cross"
                @click="deleteThis()"
            ></nitrozen-inline>
        </div>
    </div>
</template>

<style lang="less" scoped>
@import './../../less/form.less';
@import './../../less/page-ui.less';
@import './../../less/page-header.less';

.nitrozen-label {
    color: #9b9b9b;
    font-family: Poppins, sans-serif;
    font-size: 12px;
    font-weight: 500;
    line-height: 21px;
}

.cross {
    flex: 1;
}

.mt-sm {
    margin-top: 8px;
}
.main {
    display: flex;
    flex-direction: row;
    background: #ffffff;
    margin: 4px 0px;
    border: 1px solid #e4e5e6;
    border-radius: 3px;
    height: auto;
    overflow: auto;
    max-height: 100px;
    cursor: pointer;
    transition: box-shadow 0.3s;
    justify-content: space-between;
}

.cross-container {
    padding-right: 4px;
}
.product {
    display: flex;
    padding: 12px;
    padding: 8px;
    width: 95%;

    .side-image {
        display: flex;
        align-items: center;
        margin-right: 8px;
        img {
            min-height: 80px;
            max-height: 80px;
            min-width: 60px;
            max-width: 60px;
            border-radius: 4px;
        }
    }
    .card-content-section {
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: center;
        margin-left: 4px;
        .card-content-line-1 {
            color: @Mako;
            font-weight: 600;
            font-size: 16px;
            -webkit-font-smoothing: antialiased;
            line-height: 22px;
        }
        .card-content-line-2 {
            color: @DustyGray2;
            line-height: 22px;
            font-size: 12px;
        }
        .card-content-line-3 {
            color: @DustyGray2;
            line-height: 22px;
            font-size: 12px;
        }
    }
}

.image {
    display: flex;
    padding: 8px;

    .side-image {
        display: flex;
        align-items: center;
        img {
            min-height: 80px;
            max-height: 80px;
            min-width: 60px;
            max-width: 60px;
            border-radius: 4px;
        }
    }
    .card-content-section {
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: center;
        margin-left: 4px;
        .card-content-line-1 {
            color: @Mako;
            font-weight: 600;
            font-size: 16px;
            -webkit-font-smoothing: antialiased;
            line-height: 22px;
        }
        .card-content-line-2 {
            color: @DustyGray2;
            line-height: 22px;
            font-size: 12px;
        }
        .card-content-line-3 {
            color: @DustyGray2;
            line-height: 22px;
            font-size: 12px;
        }
    }
}
</style>
<script>
import {
    NitrozenInput,
    NitrozenError,
    NitrozenDropdown,
    NitrozenCheckBox,
    NitrozenChips,
    NitrozenInline
} from '@gofynd/nitrozen-vue';

// import { getAppInfo } from '@/services/utils.service';
// import { getPrimaryDomain } from '@/helper/domains.util';

export default {
    name: 'attachment',
    components: {
        'nitrozen-inline': NitrozenInline
    },
    props: {
        attachment: {
            type: Object
        },
        index: {
            type: Number
        }
    },
    data() {
        return {
            title: '',
            subTitle: '',
            subSubTitle: '',
            logoURLString: ''
        };
    },
    computed: {
        urlToOpen() {
            // return `https://${getPrimaryDomain(getAppInfo().domains)}/product/${
            //     this.attachment.value
            // }`;
        }
    },
    mounted() {
        //
    },
    methods: {
        deleteThis() {
            this.$emit(`deleteAttachmentAt`, this.index);
        }
    }
};
</script>
