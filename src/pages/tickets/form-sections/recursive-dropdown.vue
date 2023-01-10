<template>
    <div>
        <nitrozen-dropdown
            class="type-filter mt-sm"
            :label="label"
            v-model="l1_category"
            :searchable="true"
            @searchInputChange="categorySearchl1"
            :items="l1Category"
            @change="l1Changed"
            :disabled="disabled"
        ></nitrozen-dropdown>
        <nitrozen-dropdown
            v-if="l1_category != '' && l2_categories.length"
            class="type-filter mt-sm"
            :label="nameForLabel(l1_category, categories)"
            v-model="l2_category"
            :searchable="true"
            @searchInputChange="categorySearchl2"
            :items="l2Category"
            @change="l2Changed"
            :disabled="disabled"
        ></nitrozen-dropdown>
        <nitrozen-dropdown
            v-if="l2_category != '' && l3_categories.length"
            class="type-filter mt-sm"
            :label="nameForLabel(l2_category, l2_categories)"
            v-model="l3_category"
            :searchable="true"
            @searchInputChange="categorySearchl3"
            :items="l3Category"
            @change="l3Changed"
            :disabled="disabled"
        ></nitrozen-dropdown>
        <nitrozen-dropdown
            v-if="l3_category != '' && l4_categories.length"
            class="type-filter mt-sm"
            :label="nameForLabel(l3_category, l3_categories)"
            v-model="l4_category"
            :searchable="true"
            @searchInputChange="categorySearchl4"
            :items="l4Category"
            @change="l4Changed"
            :disabled="disabled"
        ></nitrozen-dropdown>
    </div>
</template>

<script>
import { NitrozenDropdown } from '@gofynd/nitrozen-vue';
// import { mapGetters } from 'vuex';
// import { ADMIN_GET_SELLER_SUPPORT_CONFIG } from '@/store/admin/getters.type';

export default {
    name: 'recursive-dropdown',
    components: {
        NitrozenDropdown
    },
    props: {
        integration: {
            type: Object
        },
        allCategories: {
            type: Object
        },
        label: {
            type: String
        },
        disabled: {
            type: Boolean,
            default: false
        },
        value: {
            required: true
        }
    },
    data() {
        return {
            l1_category: '',
            l2_category: '',
            l3_category: '',
            l4_category: '',
            l2_categories: [],
            l3_categories: [],
            l4_categories: [],
            selectedIntegrationCategory: [],
            l2_category_option: [],
            l3_category_option: [],
            l4_category_option: [],
            categories: [],

            l1Category : [],
            l2Category : [],
            l3Category : [],
            l4Category : []

        };
    },
    computed: {
        category_slug() {
            let slug = '';
            if (this.l1_category) {
                let selectedCat = this.categories.find(
                    (a) => a.key == this.l1_category
                );
                slug += `${this.l1_category} `;
                if (selectedCat && selectedCat.sub_categories.length) {
                    if (!this.l2_category) {
                        return '';
                    }
                }
            }
            if (this.l2_category) {
                let selectedCat = this.l2_categories.find(
                    (a) => a.key == this.l2_category
                );
                slug += `> ${this.l2_category} `;
                if (selectedCat && selectedCat.sub_categories.length) {
                    if (!this.l3_category) {
                        return '';
                    }
                }
            }
            if (this.l3_category) {
                let selectedCat = this.l3_categories.find(
                    (a) => a.key == this.l3_category
                );
                slug += `> ${this.l3_category} `;
                if (selectedCat && selectedCat.sub_categories.length) {
                    if (!this.l4_category) {
                        return '';
                    }
                }
            }
            if (this.l4_category) {
                slug += `> ${this.l4_category}`;
            }
            return slug;
        }
    },
    watch: {
        value() {
            this.updateForValue();
        }
    },

    mounted() {
        this.updateCategory();
    },
    methods: {
        updateForValue() {
            let str = this.value || '';
            let split = str.split('>');

            split[0] = split[0] ? split[0].trim() : '';
            this.l1_category = split[0] || '';
            this.l1Changed();

            split[1] = split[1] ? split[1].trim() : '';
            this.l2_category = split[1] || '';
            this.l2Changed();

            split[2] = split[2] ? split[2].trim() : '';
            this.l3_category = split[2] || '';
            this.l3Changed();

            split[3] = split[3] ? split[3].trim() : '';
            this.l4_category = split[3] || '';
            this.l4Changed();
        },
        updateCategory() {
            Object.keys(this.allCategories).map((integrationType) => {
                if (integrationType === this.integration.type) {
                    this.allCategories[integrationType].map((category) => {
                        let categoryDropdownOption = {
                            text: category.display,
                            value: category.key
                        };
                        this.selectedIntegrationCategory.push(
                            categoryDropdownOption
                        );
                        this.l1Category.push(categoryDropdownOption);
                        this.categories.push(category);
                    });
                }
            });
        },
        nameForLabel(slug, arr) {
            let obj = arr.find((a) => a.key == slug);
            return `${obj.display || 'Sub'} Issues`;
        },
        categorySearchl1(e){
            if(e && e.text){
                this.l1Category = this.selectedIntegrationCategory.filter(
                    (a) =>{
                        return a.text.toLowerCase().indexOf(e.text.toLowerCase()) > -1
                    }   
                );
            } else {
                this.l1Category = this.selectedIntegrationCategory
            }
        },
        categorySearchl2(e){
            if(e && e.text){
                this.l2Category = this.l2_category_option.filter(
                    (a) =>{
                        return a.text.toLowerCase().indexOf(e.text.toLowerCase()) > -1
                    }    
                );
            } else {
                this.l2Category = this.l2_category_option
            }
        },
        categorySearchl3(e){
            if(e && e.text){
                this.l3Category = this.l3_category_option.filter(
                    (a) =>{
                        return a.text.toLowerCase().indexOf(e.text.toLowerCase()) > -1
                    }      
                );
            } else {
                this.l3Category = this.l3_category_option
            }
        },
        categorySearchl4(e){
            if(e && e.text){
                this.l4Category = this.l4_category_option.filter(
                    (a) =>{
                        return a.text.toLowerCase().indexOf(e.text.toLowerCase()) > -1
                    }     
                );
            } else {
                this.l4Category = this.l4_category_option
            }
        },
        l1Changed() {
            this.l2_category_option = [];
            this.l2Category = [];
            let selectedCat = this.categories.find(
                (a) => a.key === this.l1_category
            );
            if (!selectedCat) {
                return;
            }
            this.l2_categories = selectedCat.sub_categories || [];
            this.l2_categories.map((category) => {
                let categoryDropdownOption = {
                    text: category.display,
                    value: category.key
                };
                this.l2_category_option.push(categoryDropdownOption);
                this.l2Category.push(categoryDropdownOption);
            });
            this.l2_category = '';
            this.l3_category = '';
            this.l4_category = '';
            this.emitChange();
        },
        l2Changed() {
            this.l3_category_option = [];
            this.l3Category = [];
            let selectedCat = this.l2_categories.find(
                (a) => a.key == this.l2_category
            );
            if (!selectedCat) {
                return;
            }
            this.l3_categories = selectedCat.sub_categories || [];
            this.l3_categories.map((category) => {
                let categoryDropdownOption = {
                    text: category.display,
                    value: category.key
                };
                this.l3_category_option.push(categoryDropdownOption);
                this.l3Category.push(categoryDropdownOption);
            });
            this.l3_category = '';
            this.l4_category = '';
            this.emitChange();
        },
        l3Changed() {
            this.l4_category_option = [];
            this.l4Category = [];
            let selectedCat = this.l3_categories.find(
                (a) => a.key == this.l3_category
            );
            if (!selectedCat) {
                return;
            }
            this.l4_categories = selectedCat.sub_categories || [];
            this.l4_categories.map((category) => {
                let categoryDropdownOption = {
                    text: category.display,
                    value: category.key
                };
                this.l4_category_option.push(categoryDropdownOption);
                this.l4Category.push(categoryDropdownOption);
            });
            this.l4_category = '';
            this.emitChange();
        },
        l4Changed() {
            this.emitChange();
        },
        emitChange() {
            if (this.category_slug && this.category_slug != this.key) {
                this.$emit('input', this.category_slug);
                this.$emit('change', this.category_slug);
            }
        }
    }
};
</script>

<style lang="less" scoped>
.mt-sm {
    margin-top: 8px;
}
</style>
