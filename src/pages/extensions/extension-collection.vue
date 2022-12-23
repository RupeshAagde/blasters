<template>
    <div class="panel extension-collection-list">
        <div class="main-container">
            <div class="page-container-main">
                <jumbotron
                    class="top-jumbotron"
                    :title="'Extension Collection'"
                    btnLabel="Create"
                    :desc="'Extension Collection'"
                    @btnClick="createExtensionCollection"
                ></jumbotron>
            </div>
            <div class="page-header-filter">
                <nitrozen-input
                    :showSearchIcon="true"
                    class="search-box"
                    type="search"
                    placeholder="Search Collection"
                    v-model="searchText"
                    @input="debounceInput"
                ></nitrozen-input>
                <div class="filter">
                    <label class="label">Filter</label>
                    <nitrozen-dropdown
                        class="filter-dropdown"
                        :items="stateFilterItems"
                        v-model="published"
                        ref="filter-dropdown"
                        @change="fetchCollections()"
                    ></nitrozen-dropdown>
                </div>
            </div>
            <page-empty
                :text="
                    (searchText || published.trim())
                        ? `Collection not found with filter`
                        : 'No collection Created'
                "
                v-if="!extension_collections.length && !inProgressSearch"
            >
            </page-empty>
            <list-shimmer
                v-if="inProgressSearch"
                :count="5"
                class="extension-collection-cards mr-24"
            ></list-shimmer>
            <div

                v-if="extension_collections.length > 0"
                class="extension-collection-cards"
            >
                <div
                    class="mirage-list-card-container"
                    v-for="(collection, index) in extension_collections"
                    :key="index"
                    :ref="'extension-' + index"
                    @click="redirectTo(collection._id)"
                >
                    <div class="card-avatar">
                        <img
                            :src="collection.banner.logo || defaultLogo"
                            alt="collection logo"
                        />
                    </div>
                    <div class="card-content">
                        <div class="card-content-section">
                            <div class="card-content-line-1">
                                {{ collection.name }}
                            </div>
                            <div class="card-content-line-2">
                                {{ collection.desc }}
                            </div>
                            <div class="card-content-line-3">
                                Type:
                                {{ capitalizeStr(collection.collection_type) }}
                            </div>
                        </div>
                        <div class="status">
                            <nitrozen-badge
                                state="success"
                                v-if="collection.published"
                                >PUBLISHED</nitrozen-badge
                            >
                            <nitrozen-badge v-else>UNPUBLISHED</nitrozen-badge>
                        </div>
                    </div>
                </div>
                <loader v-if="pageLoading && !pageError"></loader>
                <page-error
                    v-else-if="pageError && !pageLoading"
                    @tryAgain="fetchCollections"
                ></page-error>
                <div v-if="!inProgressSearch" class="pagination-div">
                    <nitrozen-pagination
                        name="Extensions"
                        v-model="paginationConfig"
                        ref="extension-pagination"
                        class="extension-list-pagination"
                        @change="paginationChange"
                        :pageSizeOptions="[20, 50, 100, 200]"
                    ></nitrozen-pagination>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
@import '../../pages/less/page-header.less';
@import '../../pages/less/page-ui.less';
@import '../../pages/less/form.less';
.nitrozen-form-input {
    margin-top: 12px;
}
.hidden {
    visibility: hidden;
}
.page-container-main {
    margin: 0;
    flex-direction: column;
    display: block;
    flex-wrap: wrap;
    padding: 24px;
    background-color: #ffffff;
    border-radius: 4px;
}
.pagination-div {
    padding: 0px 24px;
}
</style>

<script>
import {
    NitrozenButton,
    flatBtn,
    strokeBtn,
    NitrozenInput,
    NitrozenError,
    NitrozenPagination,
    NitrozenBadge,
    NitrozenDropdown
} from '@gofynd/nitrozen-vue';
import jumbotronVue from '@/components/common/jumbotron.vue';
import loader from '@/components/common/loader';
import pageEmpty from '@/components/common/page-empty.vue';
import pageError from '@/components/common/page-error.vue';
import pageHeader from '@/components/common/layout/page-header.vue';
import root from 'window-or-global';
import listShimmer from '@/components/common/shimmer';
import { debounce } from '@/helper/utils';
import { capitalize } from 'lodash';
import ExtensionService from '@/services/extension.service';

const env = root.env || {};

const PAGINATION = {
    limit: 20,
    current: 1,
    total: 0
};

export default {
    name: 'extension-review',
    components: {
        'nitrozen-badge': NitrozenBadge,
        'nitrozen-button': NitrozenButton,
        'nitrozen-input': NitrozenInput,
        'nitrozen-error': NitrozenError,
        'page-empty': pageEmpty,
        'page-error': pageError,
        'page-header': pageHeader,
        'list-shimmer': listShimmer,
        jumbotron: jumbotronVue,
        loader: loader,
        NitrozenPagination,
        NitrozenDropdown
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    data() {
        return {
            searchText: '',
            inProgress: false,
            pageError: false,
            pageLoading: false,
            extension_info: {},
            review_data: {
                review_comments: '',
                current_status: ''
            },
            error_comments: '',
            extension_collections: [],
            inProgressSearch: false,
            paginationConfig: { ...PAGINATION },
            published: ' '
        };
    },
    computed: {
        defaultLogo() {
            return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAASr0lEQVR4Xu2defQ/1RjH31G29lIptNgKLQ4S2qRsJSEqS0ioEFqQyBZOlkKOyJLlVJaUSmSplOK0SLKkhAjZSmVNZTlv7qe+jXvnMzPfuzx35v2c8zu/P74zc+997vP6zNx7n2UJSKQBaSCogSWkG2lAGghrQIDIOqSBFg0IEJmHNCBAZAPSwDAN6A0yTG+6ayIaECATmWgNc5gGBMgwvemuiWhAgExkojXMYRoQIMP0prsmogEBMpGJ1jCHaUCADNOb7pqIBgTIRCZawxymAQEyTG+6ayIaECATmWgNc5gGBMgwvemuiWhAgExkojXMYRoQIMP0prsmogEBMpGJ1jCHaUCADNOb7pqIBgTIRCZawxymAQEyTG+6ayIaECATmWgNc5gGBMgwvemuiWhAgExkojXMYRoQIMP0prsmogEBMpGJ1jCHaSA3IHcG8G8ANwzrru6SBvJqICcgdwFwEoAbAewoSPJOtFobpoFcgMzg2MZ180uCZNiE6a68GsgBSBOO2QgFSd65VmsDNJAaEK45TgYwe3M0uyhIBkyabsmngdSA3AnA8QC2bRmSIMk332qppwZSA8LuCJKek6LL7WggByCCxM58qyc9NZALEEHSc2J0uQ0N5AREkNiYc/WihwZyAyJIekyOLi2vgRKACJLy864edNRAKUAESccJ0mVlNVASEEFSdu7VegcNlAZEkHSYJF1STgMWABEk5eZfLc/RgBVABIlM1aQGLAFSEyRrA3i8yRkNd4o+b1dW1ufi3bUGSA2Q3A3ANwHcq/js9evA5QA2BfCHfrdN+2qLgFiGZHkAZwJ4UKVmcyGArQD8udL+Z++2VUAsQkKv5C8D2DL7LMVt8AwXfvCPuI8d59MsA2IJktu7uJYdRmIGjNHZCcC/RjKeZMOwDogVSD4K4PnJZqHMg48EsGeZputptQZASkNyCIBXt0zp1wD8zOiU37sl3JldfguAg4z23US3agGkFCT7Aji0Zaasf6p0+TR8OYDDTVijwU7UBEhuSJ4D4OMAQjqqZbHLzYWvANgiYH9M5PdsAMcatM/iXaoNkFyQbAfgRABLBmaotu3SedvTNwF4ktulK26UljpQIyCpIeFhGtcVTFnkkx8D2KzCA7fV3AEn1yU++RuArQGca8lAS/elVkBSQbI+gG8AWDEwMVcBeCSAX5SeuIHtE45zANAbwCd/BLA5gEsGPn90t9UMSApIXgDgw4FZvtYZzw8rt4KNAJwFgJ9dPvmVc0mR31bLArQmG4idd2tvz64OPz8eA+BbNSmmpa9csHPhTt355DL3GXn1SMY7eBg1vEH4S/dQAPcDsCqApQHcrjFiLqa5yFynRRN9Mji+DMB73bNuBsATdN4/JuGYuE3NrWCfXAzgtMgDnpW++B0AQngBgOsitxH1cVYBIRS7AngmgIe1TGJfZfSBhOcDhwF4LoCj+zZUyfW7ATiqYF/p6nKe22L+JIA/FeyLt2lrgDAT/AEAaJzLJVJWH0g2BPC9RP2w8lh6CdBboLQQDv4gvRMAP2lNiCVAuHXKX+q1MmimDyQZulO8iXcB2K94L/7XgSsA8JCWu23FxQogL3Hf/KHv4RSKEiS3apV28DH3OZlC132fyXUf14Ef6Htj7OstAHIggLfGHljH5wmSWxXFjY7PA3hiR93luIyf22/P0VCojdKAtJ07LOwz9+b5yv2JW8hxN6SLcNK5yF6v5WJBcqty6D2wR4uLTRedz7tmWQD3ddvI95x3MQBuJNAnroiUBOTB7lzhji0j/wKAdyzyezT2OUmRiRppozy1f9WctxYjHzcBwG3n7FIKEP6yfwfABoERM7EAfzm+GEkjgiSSIhM9hp91XAPdNfD8iwBsDOCfidoPPrYUIHsBOCLQq587p7nYQUiCJLd19WuPfmIMIVgzcBs/xxnZmVVKAMK3B9cSvu3c690vBVPUpBBBkkKr8Z65LoDzA2dg/MHk2iVrHH0JQBhrcUpApzw9T31qLUjiGXSKJ7Wd7jNZH33IskkJQOhSQBCa8m339sgxeEGSQ8vD2qBNcn3qyz3GTyx+amWTEoD8GsAanhHmeHssbFaQZDOz3g09zy3amzfSBT+Hp8Ut7eYGhFFtv/WoiyenKxXI+CdIettulhtWAHCNx2ubja8CIJsbfm5A6G91tkfFdAhkIE8JKQUJHTN5gMkcv6u7KEb2hT8WTA3Kf/wxYYgvNzVuLKGcgm0yMO0BnvYfkTMsODcgjNk4yTNoHgjyb6UkByQ8pWbQ1ePcKfIDe7jxc/+fBvN1txV6OoC/llJWpnbp4fAET1vbt2zyRO9abkB2BvBpzyg+A2CX6KPr98BUkDCX7wsBPNkFe/Xrlf/qvwA4AcAnHDRdXW9itJ3rGZ8DsKOnsae5QK8s/cgNCCH4lFFA2K3YkHCCOdEphZ+nbwNwXO4zgpSDcnrzAfL0DDq9ZWgC5P9nOTYkrwDw7sTGxMfzE+ylrjxDhuaSNxF6gwiQ5Kqf30BsSBgh+Z75zUa54hgXkcldoJpFgCyYPQtrkKYxxYZkYSKIWVu/AfADF0X3exdquhSAZdyuFv2T6H7hOzdqM36GBzxjkV7QpeESIMYBSbEm4ScQF+0nu8U1DbmL3APAo13hG+72hbI+LnwWt4vpSp7j867LGPpeI0AqACQFJH0NpXk9k1lws2N/57w373mMNycote10CZBKALEICfvE+H1umzMklW+YNqEPE7eaa4JEgFQEiFVI2C+uV94IYJ+Aa8ZMzUynwzdJLSJAKgNkBgk9Te/fYmWlYtx5Ss9QAWafDAm3nGcZI62DIkAqBIQllFkaYV56olKQMAkC4yVCAHPhzk2CGnIMC5DKAFkZwPedY2GXX99SkNArmuWqGcPtk1+6WAuWOrAsAqQyQOhDxkVxHykJCdMkhd4k9OFizIVlESAVAUIPXP4q+4RpadpSF5WChJ9bLBXH+ImmcDeLn1q+0AMr0AiQSgDheoMOgb7YBCYQ2NalyeT/ISkFCcE+NVAHhmNiWKvVrV8BUgkgTKTMTxKf8BDulQm8gGP+ivMknbtXPqG3LN3mLYoAqQAQejvTV8r39mCdQn7j/92NI7bvViyjZarPSwP+XNyyfkishiI/R4BUAMg2blvXN/cs7tOMbbEKSdtbkGsRFi61JgKkAkDoZbyTx3L4i8y3iu/73SIkXEcxtp3x703JnkqnI4kCxDggdOGgC7rPc/ZFLdVwOSyLkLwYwPs9xsnKTiwLPftU7Gi/yS8TIMYBeWog9pnx4DSoeUkTrEHC2u+MP/FtSTM5QmgbOzkJgQYEiHFAPuhqZTTnj+sOrj+6iDVIQkZn0ZFRgBgHhLtXTM3TFN/ivA0WS5CEChbxQJGlti2JADEMCJO6MXFbsx47u8zwV36q9BErkLCOvK+sBJPScczZ62+0KFGAGAaE1a/4q9oUhsh2KRvmm3crkLA4ka9QDUsLMIOjFREghgFhcjLmmWoKXcmZgn+oWICEToybegbAKk+xKnoN1c/C+wSIYUD2BnC4Z5aPBLDnIme/NCQsiMnCpk3ZHcBRixxbzNsFiGFADgLwZs9ss1z16yJYQUlImJ+LebqaYi3aUIAYBoQgsH57UwhHrJrupSA5OAD56wHwb1ZEgFQIyBsCb5ahRlUCEoLwJk+H+cbk+KyIADEMSMiIUhyo5YaEaYJ82U1eA+AQK3QoefVtZ8Ja6tHQIv0jLr9UbDvKCQnrkfvCbbn5wE0IK6I3iOE3SGiblwVsmAI0heSC5EwXbtscA1OaspCRFREghgEJHRReBeDuCS0oByT0UPbFqdOt5pKEY+v7aAFiGJA2VxOepHdNOt3XKHh9SkgYD/JTT6foakL3/puGdDjRPQLEMCDsWshZkYdsrPWeUlJBEnJWzFmjvqveBIhxQELu7rk2FFJAwgKqvmKphwHYr6vlZrpOgBgHJBQwxcg7BkwxEi+1xIaE9Une5+n0Y1ti71OPMfR8AWIckLaQ2z0AfCiT5cSGpLmFfZ1LeG1p/UHVChDjgLB7oaQNl7uUP7niJ2JDsrAcXKqzncX+fgiQCgBhSYGvBmb6WQCOXawV9Lg/NiSzwqKbADi/Rz9yXSpAKgCkLXEct3qZOI5JHHJJbEh2AMCFu0URIBUAwi62JV071NUKzGlgsSHJ2fc+bQmQSgBh0jXWBfGVEmDyakYYsqhOTpkCJAKkEkDYzbbyB3TdYEYQFqbJKWOHRIBUBAi7GtrR4t9+BGAzALmrNo0ZEgFSGSDMBMJPLR4S+uQC97klSOK8RwVIZYCwu8z2zhSdoSKefJPwc0yfW4uHRIBUCAi7vD8ARhaGhHmndnXVZhdvJt2f8BT3GbhUyy2lKl11H8WtVwqQSgFht5klndnSQ8KyCKxHztBdZmhMKcsBYBgt3V94bjNPaoFEgFQMCA2ROaTmVYplgBVjvY9JkNZzSQC7uSQSoXVRCJYaIBEgFQPCrhMSviXo/DdPmA+Xh4rMDH/tvIvn/H0F9wnHPFa+gjhdH28dEgFSOSCz7u/j1iShhftCg2XJ6FPcQv90AFd0tOa1AGwFYHtXVZfbu/OE3rmXAVi/5ULLkAiQkQDCYdB4jw4Uymwz5KudETNpNN3OuV6hYS/tXNAJBmPFV51HQ+PvVwLYBcBFrgiQxRLV84YkQEYECIeyssvn27W4zjwDGfp3pvXhW+1694BaDxMFyMgAmQ1nawCsTb7BUAsfeB9LOhMMX8XaGiERICMFhMNi4Z2dARwAYMOBBt/1tu+6fMHHB6ruzp5TGyQCZMSALDRurk+YTYSxF1xbxBCuVU4AwBLOZ/d4YE2QCJCJADIbJstJ8/OLCRLo2MjdpbZT74V2z4U7/cD4+cQIxzMAcEdsiNQCiQCZGCBNY74DAJY941nG6gBWcknjeL7CzCk8L2EtRCZ6Yww8k7vFkhogESATBySWsQ99jnVIBIgAGWrb0e6zDIkAESDRDH0xD7IKySQB2cm5ZDcn9LNuW3QxE617h2vAIiQhQFiaglvaWaSLe3TMjrDUsK8GBX2CtovZkJ7VWwPWIGHJbe74NYV2QnvJIrkBYZKycz0jo1PdellGrEbaNGAJEu7e+byVNwbAbPRZJDcgKwYSGzDAaDUAjMaTlNWABUi47c1YGp8snylx+H/bzg0I2+Se/n08I2fmcUbqScproDQkjHWhP1tTLg3kJ0umsRKAHAFgL8+I6PLN5Gw3JxutHtxHA6Ug4QEqQVjH01kGqBGebFICkM0DHqccNJ37GF8tsaGBEpAc6JwvfRp4OIDzcqqmBCAc38UBL1f6HNFfqY8DXk59TbGtnJBs6dK4+nzULnQZLLPOQSlAdnQFUnyDZaAPt4PPyaoJNdamgRyQbOHCkZcNdKRImepSgFAHp7m3hU8fdMx7rVuo5SpSI0TaNZAKEmZn2RfAwQC4/vDJqS4WP/sclQRkTQAM9uHWb0h4PsJsIMe5mO3sClKDt9FAbEjWcK7767bomXH7G7Vs+yadopKAcGA8KWWWj3lxEXyLsCwzd7pYPJNlByRlNMDsLVwnsl58SPpkSwlt6fLZ/JKgjZxVZqhlzkGaY6V/FjOCzIOklI7U7jAN9IFkVg5uYUuEg2HLJw5rPs5dpd8gs1Ew4TOTqrV9bsUZsZ6SUwN9IFlYWPQaAHRKPDNnZ31tWQGEfVsbAFPWPKq0UtR+VA30gYRZKrmDuTsA1oAsLpYAmSmDn1xM+syEaZJxaKAPJKZGbBEQKoj9YjYQJmFjKWbueEnq1kCVkFgFpGkK9O7kVuAqAJZpKWBTtwnV3XtustDHri1hXnWQ1AJI3aYznd7HPicprjkBUnwKRteBUUEiQEZnnyYGNBpIBIgJexplJ0YBiQAZpW2aGVT1kAgQM7Y02o5UDYkAGa1dmhpYtZAIEFN2NOrOVAmJABm1TZobXHWQCBBzNjT6DlUFiQAZvT2aHGA1kAgQk/YziU5VAYkAmYQtmh2keUgEiFnbmUzHTEMiQCZjh6YHahYSAWLabibVOZOQCJBJ2aD5wZqDRICYt5nJddAUJAJkcvZXxYDNQCJAqrCXSXbSBCQCZJK2V82g50GSPAmEAKnGVibb0RAkyeGgxgXIZO2uqoE3IckChwCpykYm39kZJFQECzDdkEMjeoPk0LLaiKUBQkLJAofeILGmTc8ZrQb0Bhnt1GpgMTQgQGJoUc8YrQYEyGinVgOLoQEBEkOLesZoNSBARju1GlgMDQiQGFrUM0arAQEy2qnVwGJoQIDE0KKeMVoNCJDRTq0GFkMDAiSGFvWM0WpAgIx2ajWwGBoQIDG0qGeMVgMCZLRTq4HF0IAAiaFFPWO0GhAgo51aDSyGBgRIDC3qGaPVgAAZ7dRqYDE0IEBiaFHPGK0G/gMxSqMFF1lg7gAAAABJRU5ErkJggg==';
        },
        stateFilterItems() {
            return [
                { value: ' ', text: 'All' },
                { value: 'true', text: 'Published' },
                { value: 'false', text: 'Unpublished' }
            ];
        }
    },
    mounted() {
        if (this.$route.query.name) {
            this.searchText = this.$route.query.name;
        }
        if (this.$route.query.page_no) {
            this.paginationConfig.current = parseInt(this.$route.query.page_no);
        }
        if (this.$route.query.page_size) {
            this.paginationConfig.limit = parseInt(this.$route.query.page_size);
        }
        if ((this.$route.query.published || "").trim()) {
            this.published = this.$route.query.published;
        }
        this.fetchCollections();
    },
    methods: {
        paginationChange(config) {
            this.paginationConfig = config;
            this.fetchCollections();
        },

        debounceInput: debounce(function(e) {
            this.paginationConfig.current = PAGINATION.current;
            this.paginationConfig.limit = PAGINATION.limit;
            this.fetchCollections();
        }, 500),
        capitalizeStr(str) {
            return capitalize(str);
        },
        fetchCollections() {
            this.inProgressSearch = true;
            let params = {
                page_no: this.paginationConfig.current,
                page_size: this.paginationConfig.limit
            };
            if (this.searchText.trim()) {
                params['name'] = this.searchText;
            }
            if (this.published.trim()) {
                params['published'] = this.published;
            }
            this.$router
                .push({
                    query: { ...params }
                })
                .catch((err) => {});
            params['category'] = 'extension';
            ExtensionService.getExtensionCollections(params).then((res) => {
                this.extension_collections = res.data.items;
                this.paginationConfig = res.data.page;
                this.paginationConfig.total = res.data.page.item_total;
                this.paginationConfig.limit = res.data.page.size;
            })
            .finally(()=>{
                this.inProgressSearch = false;
            });
        },
        createExtensionCollection() {
            this.$router
                .push(`/administrator/extensions/collection/create`)
                .catch(() => {});
            //TODO: Add form dirty
        },
        redirectTo(id) {
            this.$router.push({
                path: `/administrator/extensions/collection/edit/${id}`
            });
        }
    }
};
</script>
<style lang="less" scoped>
.extension-collection-list {
    .main-container {
        background-color: #ffffff;
        flex-direction: column;
    }
    .page-header-filter {
        padding: 0px 24px;
        margin-bottom: -10px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .search-box {
            min-width: 400px;
        }
        .filter {
            display: flex;
            flex-direction: row;
            align-items: center;
            .filter-text {
                color: @Mako;
                font-size: 14px;
                line-height: 20px;
                font-weight: 500;
            }
            select {
                background-color: @White;
                border: 1px solid @Iron;
                border-radius: 3px;
                height: 40px;
                color: @Mako;
                font-size: 14px;
                padding: 5px 10px;
            }
        }
        .filter-dropdown {
            width: 200px;
            margin-left: 12px;
        }
    }
    .extension-collection-cards {
        padding: 24px;
    }
    .mirage-list-card-container {
        background: #ffffff;
        margin: 16px 0px;
        border: 1px solid #e4e5e6;
        padding: 24px;
        border-radius: 3px;
        display: flex;
        height: 70px;
        overflow: auto;
        max-height: 70px;
        cursor: pointer;
        transition: box-shadow 0.3s;
        .card-avatar {
            margin-right: 24px;
            width: 60px;
            height: 60px;
            align-self: center;
            border-radius: 50%;
            img {
                width: 100%;
                height: 100%;
            }
        }
        .card-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
        }
        .card-content-section {
            display: flex;
            flex: 1;
            flex-direction: column;
            justify-content: center;
            .card-content-line-1 {
                color: #41434c;
                font-weight: 600;
                font-size: 16px;
                -webkit-font-smoothing: antialiased;
                line-height: 22px;
            }
            .card-content-line-2 {
                color: #9b9b9b;
                line-height: 22px;
                font-size: 12px;
            }
            .card-content-line-3 {
                color: #9b9b9b;
                line-height: 22px;
                font-size: 12px;
            }
        }
    }
}
</style>
