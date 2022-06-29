<template>
    <transition name="slide">
        <div
            v-if="show && section_schema && section_schema.props" 
            class="section-form-container">
            <div class="header">
                <adm-inline-svg
                    class="back-btn"
                    :src="'arrow-nitrozen'"
                    @click.stop.native="onCloseClick($event)"
                />
                <h3 class="title">{{section_schema.name}}</h3>
            </div>

            <div class="form-body nitrozen-scrollbar">
                <h2 class="heading">Settings</h2>
                <div class="settings-form">
                    <dynamic-input
                        v-for="(prop_schema, i) in sectionSchemaProps"
                        :key="prop_schema.id"
                        :prop_schema="prop_schema"
                        :prop="section.props[prop_schema.id]"
                        :name="`section-${section.name}-${i}`"
                        :page="page"
                        :items="section.items"
                        :error="errors[prop_schema.id]"
                        :ref="prop_schema.id"
                        @change="onSectionInputChange(prop_schema, $event)"
                        @searchInputChange="onSearchInputChange(prop_schema, $event, i)"
                    />
                </div>

                <div class="selected-items" v-if="itemValues && itemValues.length">
                    <p class="items-title">{{ selectedItemsTitle }}</p>
                    <div>
                        <draggable
                            :list="itemValues"
                            :move="onMove"
                            v-bind="dragOptions"
                            class="sections"
                            @change="onChange"
                            handle=".handle"
                            @start="
                                dragging=true;
                                $emit('zoom-out');
                            "
                            @end="dragStop"
                        >
                            <transition-group
                                type="transition"
                                :name="!dragging ? 'flip-list' : null"
                            >
                                <div
                                    v-for="(item, i) in itemValues"
                                    :key="`${i}`"
                                    class="section"
                                >
                                    <div class="drag" @mouseup="dragStop" @mousedown="dragStart(i)">
                                        <adm-inline-svg
                                            class="handle"
                                            :src="'move'"
                                            :class="{ grabbable: dragging }"
                                        />
                                    </div>

                                    <div class="title-container">
                                        <span class="title">{{item.name || item.display}}</span>
                                        <span
                                            @click="removeItem(i)"
                                            class="section-settings remove"
                                        >
                                            <adm-inline-svg :src="'cross-black'" />
                                        </span>
                                    </div>
                                </div>
                            </transition-group>
                        </draggable>
                    </div>
                </div>

            </div>
        </div>
    </transition>
</template>

<script>
/* Component imports */
import AdmInlineSVG from '@/components/common/adm-inline-svg.vue';
import DynamicInput from './dynamic-input';
import { NitrozenError } from '@gofynd/nitrozen-vue';

/* Package imports */
import Draggable from 'vuedraggable';
import cloneDeep from 'lodash/cloneDeep';

/* Service imports */
import ExtensionPageService from '@/services/extension-page.service.js';

/* Helper imports */
import { titleCase } from '../../../helper/utils';

export default {
    name: 'section-form',
    props: ['section_schema', 'section', 'show', 'page'],
    components: {
        'adm-inline-svg': AdmInlineSVG,
        'dynamic-input': DynamicInput,
        'draggable': Draggable,
        'nitrozen-error': NitrozenError
    },
    mounted() {
        this.mSection_data = this.section_data || {};
        if(this.section.data && this.section.item_type) {
            this.itemValues = cloneDeep(this.section.data[`${this.section.item_type}_details`]);

            let sectionItemTypeProp = this.section_schema.props.find(t => t.id === this.section.item_type);
            let sectionItemTypeIdx = this.section_schema.props.findIndex(t => t.id === this.section.item_type);
            this.onSearchInputChange(sectionItemTypeProp, {type: 'select', value: {text: ''}}, sectionItemTypeIdx);
        }
    },
    computed: {
        selectedItemsTitle() {
            if(this.section.item_type !== 'category') {
                if(this.selectedItemsLength > 1) {
                    return `${this.selectedItemsLength} Selected ${titleCase(this.section.item_type)}s`;
                } else {
                    return `${this.selectedItemsLength} Selected ${titleCase(this.section.item_type)}`;
                }
            } else {
                if(this.selectedItemsLength > 1) {
                    return `${this.selectedItemsLength} Selected Categories`;
                } else {
                    return `${this.selectedItemsLength} Selected Category`;
                }
            }
        },
        selectedItemsLength() {
            if(this.itemValues.length) return this.itemValues.length;
        },
        sectionSchemaProps() {
            let props = this.section_schema.props.map(prop => {
                prop.display = true;
                
                if(prop.type === 'radio' && prop.options.length === 0) {
                    prop.display = false;
                }

                if(prop.id === 'item_source' && prop.type === 'select' && prop.options.length === 0) {
                    prop.display = false;
                }
                if(prop.predicate_prop) {
                    for(let key in prop.predicate_prop) {
                        if(key === 'button_label' || key === 'image') {
                            if(!this.section.data[key]) {
                                prop.display = true;
                            } else {
                                prop.display = false;
                            }
                        } else if(key === 'collection_source') {
                            prop.display = this.section.data[key].length > 0 ? true : false;
                        } else {
                            if(this.section.data) {
                                prop.display = Array.isArray(prop.predicate_prop[key])? prop.predicate_prop[key].includes(this.section.data[key]): this.section.data[key] === prop.predicate_prop[key];
                            }
                        }
                    }
                }
                return prop;
            });
            return cloneDeep(props);
        }
    },
    updated() {
        console.log("this.itemValues:   ", this.itemValues);
    },
    data() {
        return {
            showAvailableBlocksSelectionPopup: false,
            dragging: false,
            dragOptions: {
                animation: 200,
                group: 'description',
                disabled: false,
                ghostClass: 'ghost',
            },
            startingIndex: -1,
            movingIndex: -1,
            itemValues: [],
            errors: {}
        };
    },
    methods: {
        onCloseClick(e) {
            this.$emit('close');
        },
        fetchExtensionsOfCollection(collectionId, query) {
            let initialQuery = {
                page_no: 1,
                page_size: 10
            };

            let finalQuery = {
                ...initialQuery,
                ...query
            };

            return ExtensionPageService.fetchCollectionExtensions(finalQuery, collectionId)
            .then(response => {
                return response.data.items;
            })
            .catch(error => {
                console.log("error:   ", error);
            })
        },
        onSectionInputChange(prop, inputObj) {
            this.$set(this.section.props, prop.id, inputObj);
            this.$set(this.section.data, prop.id, inputObj.value);

            /* If the item source selected is API, we need to remove existing details info. */
            let removeSelections = false;
            if(
                prop.id === 'item_source' &&
                (inputObj.value === 'api' || inputObj.value === 'collection')
            ) {
                if(this.section.data.collection_source) {
                    this.$set(this.section.data, 'collection_source', '');
                    this.$set(this.section.props['collection_source'], 'value', '');
                }
                removeSelections = true;
            } else removeSelections = false;

            if(prop.id === 'item_source' && inputObj.value !== 'api') {
                this.$set(this.section.data, 'api_source', '');
            }

            // if(prop.id === 'collection_source' && inputObj.value) {
            //     /* Clearing old data */
            //     console.log("this.section:   ", this.section);
            //     this.$set(this.section.props[this.section.item_type], 'value', []);
            //     this.$set(this.section.props[this.section.item_type], 'details', []);
            //     this.$set(this.section.data, `${this.section.item_type}_details`, []);
            //     if(this.itemValues.length) {
            //         this.itemValues = cloneDeep([]);
            //     }
            //     this.$set(this.section.data, this.section.item_type, []);

            //     this.fetchExtensionsOfCollection(inputObj.value)
            //     .then(response => {
            //         let extensionProp = this.section_schema.props.find(p => p.id === this.section.item_type);
            //         extensionProp.options = cloneDeep(response).map(item => {
            //             item.name = item.listing_info.name;
            //             item.text = item.listing_info.name;
            //             item.logo = item.listing_info.icon;
            //             item.value = item._id;
            //             return item;
            //         });
            //     })
            //     .catch(error => {
            //         console.log("error:   ", error);
            //     })
            // }                 

            if(removeSelections) {
                this.$set(this.section.props[this.section.item_type], 'value', []);
                this.$set(this.section.data, `${this.section.item_type}_details`, []);
                if(this.itemValues) {
                    this.itemValues.length = 0;
                }
                this.$set(this.section.data, this.section.item_type, []);
                this.$set(this.section, 'items', []);
            }

            if(prop.id === 'collection_source' && inputObj.value) {
                this.$set(this.section, 'items', []);
                this.$set(this.section.props[this.section.item_type], 'value', []);
                this.$set(this.section.props[this.section.item_type], 'details', []);
                this.$set(this.section.data, `${this.section.item_type}_details`, []);
                if(this.itemValues.length) {
                    this.itemValues = cloneDeep([]);
                }
                this.$set(this.section.data, this.section.item_type, []);

                let extensionProp = this.section_schema.props.find(s => s.id === this.section.item_type);
                if (inputObj.details.slug) {
                    this.$set(this.section.data, 'button_page_link', `/collections/${inputObj.details.slug}`);
                }

                 this.fetchExtensionsOfCollection(inputObj.value)
                .then(response => {
                    extensionProp.options = cloneDeep(response).map(item => {
                        item.name = item.listing_info.name;
                        item.text = item.listing_info.name;
                        item.logo = item.listing_info.icon;
                        item.value = item.extension_id;
                        return item;
                    });

                    extensionProp.predicate_prop = {
                        item_source: 'collection',
                        collection_source: true
                    }
                })
                .catch(error => {
                    console.log("error:   ", error);
                })
            }

            if(inputObj.details) {
                console.log(this.section.data);
                this.$set(this.section.data, `${prop.id}_details`, inputObj.details);
                let _data = cloneDeep(this.itemValues);
                this.itemValues = cloneDeep(this.section.data[`${prop.id}_details`]);

                if(this.itemValues && this.itemValues.length) {
                    this.itemValues.map((ele, index) => {
                        if(!ele) {
                            this.$set(this.itemValues, index, _data[index]);
                            this.$set(this.section.data[`${prop.id}_details`], index, _data[index]);
                        }
                    })
                }
            }            
            this.$emit('update-block', this.section);
        },
        onSearchInputChange(prop, searchObj, idx) {
            let obj = {
                type: prop.id,
                value: searchObj.value,
                idx: idx,
                section_type: this.section.type
            }
            this.$emit('search-input', obj);
        },
        
        onMove(e) {
            //check if first move
            //track temperory position of the element being dragged
            //if first move then original index
            //else use index stored
            this.movingIndex =
                this.movingIndex === -1
                    ? e.draggedContext.index
                    : this.movingIndex;
            //assign temp moving index
            this.movingIndex = e.draggedContext.futureIndex;
            this.startingIndex = e.draggedContext.index;
        },
        onChange(d) {
        },
        dragStart(index) {
            this.$emit('zoom-out');
        },
        dragStop() {
            let details = cloneDeep(this.section.data[`${this.section.item_type}_details`]);
            details.splice(this.movingIndex, 0, details.splice(this.startingIndex, 1)[0]);

            let ids = details.map(i => i._id);
        
            this.section.data[`${this.section.item_type}_details`] = cloneDeep(details);
            this.section.data[`${this.section.item_type}`] = cloneDeep(ids);
            let _data = cloneDeep(this.itemValues);
            this.itemValues = cloneDeep(this.section.data[`${this.section.item_type}_details`]);
            this.itemValues.map((ele, idx) => {
                if(!ele){
                    this.$set(this.itemValues, index, _data[idx]);
                    this.$set(this.section.data[`${this.section.item_type}_details`], idx, _data[idx]);
                    this.$set(this.section.data[`${this.section.item_type}`], idx, _data[idx]);
                }
            });

            this.$emit('update-block', this.section);

            this.dragging = false;
            this.movingIndex = -1;
            this.startingIndex = -1;
            this.$emit('zoom-in');
        },
        removeItem(index) {
            this.section.data[`${this.section.item_type}_details`].splice(index, 1);

            let detailsArr = cloneDeep(this.section.data[`${this.section.item_type}_details`]);
            let ids = detailsArr.map(i => i._id);

            this.section.data[`${this.section.item_type}`] = cloneDeep(ids);
            let sectionProps = cloneDeep(this.section.props);
            sectionProps[`${this.section.item_type}`].value = cloneDeep(ids);
            this.section.props = cloneDeep(sectionProps);
            
            let _data = cloneDeep(this.itemValues);
            this.itemValues = cloneDeep(this.section.data[`${this.section.item_type}_details`]);
            this.itemValues.map((ele, idx) => {
                if(!ele){
                    this.$set(this.itemValues, index, _data[idx]);
                    this.$set(this.section.data[`${this.section.item_type}_details`], idx, _data[idx]);
                    this.$set(this.section.data[`${this.section.item_type}`], idx, _data[idx]);
                }
            })

            this.$emit('update-block', this.section);
        },
        validate() {
            const itemCount = this.section.item_type? this.section.data[this.section.item_type].length: 0;
            if (this.section.data['item_count'] && parseInt(this.section.data['item_count']) != itemCount) {
                this.$set(this.errors, this.section.item_type , `Selected items count should be ${this.section.data['item_count']}`);
                return false
            }
            return true;
        }
    }
}
</script>

<style lang="less" scoped>
.section-form-container {
    height: 100vh;
    width: 100%;
    position: absolute;
    box-sizing: border-box;
    background-color: #f8f8f8;
    z-index: 1;
    .header {
        box-sizing: border-box;
        background: #fff;
        position: fixed;
        // top: 0;
        width: 300px;
        z-index: 5;
        display: flex;
        padding: 0 10px;
        height: 50px;
        box-shadow: 0 0 0 1px rgba(63, 63, 68, 0.05),
            0 1px 3px 0 rgba(63, 63, 68, 0.15);
        align-items: center;

        .back-btn {
            height: 24px;
            justify-content: flex-start;
            cursor: pointer;
            margin-bottom: 0;
        }
        .title {
            font-weight: bold;
            width: 100%;
            font-size: 20px;
            text-align: center;
        }
    }
    .form-body {
        margin-top: 50px;
        overflow: hidden;
        overflow-y: scroll;
        height: calc(100vh - 110px);
    }
    .heading {
        color: #41434c;
        background-color: #eaeaea;
        font-size: 15px;
        height: 50px;
        text-transform: uppercase;
        padding: 0 10px;
        display: flex;
        font-weight: bold;
        align-items: center;
        border-bottom: 1px solid #dfe3e8;
    }
    .settings-form {
        padding: 10px;
        // padding-bottom: 50px;
        padding-bottom: 20px;
    }
    .blocks-form {
        .blocks {
            border-top: 1px #dadada solid;
            width: 100%;
            .block {
                align-items: center;
                justify-content: space-between;
                display: flex;
                padding: 0px 10px;
                height: 64px;
                box-sizing: border-box;
                background: #fff;
                border-bottom: 1px #dadada solid;
                &:first-of-type {
                    border-top: 1px #dadada solid;
                }
                .handle {
                    height: 24px;
                    cursor: grab;
                    margin-right: 10px;
                }
                .title {
                    cursor: pointer;
                    display: inline-flex;
                    justify-content: center;
                    align-items: center;
                    height: 100%;
                    flex: 1;
                }
                .remove-block {
                    height: 10px;
                    cursor: pointer;
                }
            }

            .block-inputs {
                padding: 10px;
                border-bottom: 1px #dadada solid;
            }
        }
        .add-block {
            display: flex;
            justify-content: center;
            color: #5c6ac4;
            height: 64px;
            align-items: center;
            border-bottom: 1px #dadada solid;
            position: relative;
            cursor: pointer;
            .add-block-icon {
                margin-right: 10px;
            }
        }

        .block-options {
            color: #000000;
            background: white;
            width: 100%;
            border-bottom: 1px #dadada solid;
            .option {
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
            }
        }
    }
}

.selected-items {
    padding: 0px 10px;
    padding-bottom: 20px;

    .items-title {
        margin-bottom: 1rem;
    }
}

.sections {
    width: 100%;

    .section {
        align-items: center;
        justify-content: space-between;
        display: flex;
        padding: 0px 10px;
        height: 64px;
        box-sizing: border-box;
        background: #fff;
        border: 1px #DADADA solid;
        border-bottom: 0;

        &:first-of-type {
            border-top: 1px #dadada solid;
        }

        &:last-of-type {
            border-bottom: 1px #DADADA solid;
        }

        .handle {
            height: 24px;
            cursor: grab;
            margin-right: 10px;
        }

        .title-container {
            display: flex;
            flex: 1;
            justify-content: space-between;
            align-items: center;
            min-width: 0;
            
            .title {
                cursor: pointer;
                font-size: 15px;
            }
        }
    }
}

.section-settings {
    margin: 0px 3px;
    cursor: pointer;
}

/deep/ .nitrozen-select {
    border: 1px solid #e4e5e6 !important;
}
/deep/ .nitrozen-options {
    width: auto !important;
}
/deep/ .nitrozen-scrollbar::-webkit-scrollbar-track {
    background-color: #ffffff;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.4);
}
.slide-leave-active,
.slide-enter-active {
    transition: 0.3s;
}
.slide-enter {
    transform: translate(-100%, 0%);
}
.slide-leave-to {
    transform: translate(-100%, 0%);
}

.flip-list-move {
    transition: transform 0.5s;
}
.no-move {
    transition: transform 0s;
}
.ghost {
    opacity: 0.5;
    background: #c8ebfb;
}
</style>
