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
                        @change="onSectionInputChange(prop_schema, $event)"
                        @searchInputChange="onSearchInputChange(prop_schema, $event, i)"
                    />
                </div>

                <div class="selected-items" v-if="itemValues.length">
                    <p class="items-title">Selected Items</p>
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
                                    <div @mouseup="dragStop" @mousedown="dragStart(i)">
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

                <div 
                    class="blocks-form"
                    v-if="section_schema.blocks && section_schema.blocks.length">
                    <h2 class="heading">Blocks</h2>
                    <draggable
                        :list="section.blocks"
                        v-bind="dragOptions"
                        @start="dragging = true"
                        @end="dragging = false"
                        class="blocks"
                        @change="onBlocksListChange($event)"
                        handle=".handle">
                        <transition-group
                            type="transition"
                            :name="!dragging ? 'flip-list' : null"
                        >
                            <div
                                v-for="(block, i) in section.blocks"
                                :key="`${i}`"
                            >
                                <div class="block">
                                    <adm-inline-svg
                                        class="handle"
                                        :src="'move'"
                                    />
                                    <span
                                        @click.stop="onBlockClick(block)"
                                        class="title">
                                        {{ block.name }}
                                    </span>
                                    <span @click="removeBlock(i)">
                                        <adm-inline-svg
                                            class="remove-block"
                                            :src="'cross-black'"
                                        />
                                    </span>
                                </div>

                                <div class="block-inputs" v-if="block.expand">
                                    <dynamic-input
                                        v-for="(prop_schema,
                                        j) in section_schema.blocks.find(
                                            (b) => b.type == block.type
                                        ).props"
                                        :key="j"
                                        :prop_schema="prop_schema"
                                        :prop="block.props[prop_schema.id]"
                                        :name="`block-${block.name}-${i}-${j}`"
                                        :page="page"
                                        @change="
                                            onBlockInputChange(
                                                block,
                                                prop_schema,
                                                $event
                                            )
                                        "
                                    />
                                </div>
                            </div>
                        </transition-group>
                    </draggable>

                    <div
                        class="add-block"
                        role="group"
                        slot="footer"
                        key="footer"
                        @click.stop="onAddButtonClick($event)"
                    >
                        <adm-inline-svg
                            class="add-block-icon"
                            :src="'add-icon'"
                        />
                        <span>Add Block</span>
                    </div>

                    <div
                        slot="footer"
                        v-click-outside="onBlockSelectionOutsideClick"
                        v-if="showAvailableBlocksSelectionPopup"
                        class="block-options"
                    >
                        <div
                            class="option"
                            @click="onBlockOptionClick(blockSchema)"
                            v-for="(blockSchema, i) in section_schema.blocks"
                            :key="`${i}-${blockSchema.name}`"
                        >
                            <span class="title">{{ blockSchema.name }}</span>
                        </div>
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

/* Package imports */
import Draggable from 'vuedraggable';
import cloneDeep from 'lodash/cloneDeep';

export default {
    name: 'section-form',
    props: ['section_schema', 'section', 'show', 'page'],
    components: {
        'adm-inline-svg': AdmInlineSVG,
        'dynamic-input': DynamicInput,
        'draggable': Draggable
    },
    mounted() {
        this.mSection_data = this.section_data || {};
        this.getBlocks();
        if(this.section.data && this.section.item_type){
            this.itemValues = cloneDeep(this.section.data[`${this.section.item_type}_details`]);       
        }
    },
    watch: {
        section(n, o) {
            this.getBlocks();
            // console.log("[watch] this.section:   ", this.section);
        },
    },
    updated() {
        // console.log("this.section:   ", this.section);
        // console.log("this.itemValues:    ", this.itemValues);
        // this.itemValues = cloneDeep(this.section.data[`${this.section.item_type}_details`]);
    },
    computed: {
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
                        if(key === 'button_label') {
                            if(this.section.data[key].length !== 0) {
                                prop.display = true;
                            } else {
                                prop.display = false;
                            }
                        } else {
                            if(this.section.data && this.section.data[key] === prop.predicate_prop[key]) {
                                prop.display = true;
                            } else {
                                prop.display = false;
                            }
                        }
                    }
                }
                return prop;
            });
            return cloneDeep(props);
        },
        // itemValues() {
        //     if(this.section.item_type) {
        //         return cloneDeep(this.section.data[`${this.section.item_type}_details`]);
        //     } else return null;
        // }
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
            movingIndex: -1,
            itemValues: []
        };
    },
    methods: {
        onCloseClick(e) {
            this.$emit('close');
        },
        onSectionInputChange(prop, inputObj) {
            // this.section.props[prop.id] = inputObj;
            this.$set(this.section.props, prop.id, inputObj)
            // this.section.data[prop.id] = inputObj.value;
            this.$set(this.section.data, prop.id, inputObj.value)
            // this.section.data[`${prop.id}_details`] = inputObj.details;
            this.$set(this.section.data, `${prop.id}_details`, inputObj.details)
            let _data = cloneDeep(this.itemValues)
            this.itemValues = cloneDeep(this.section.data[`${prop.id}_details`]);
            this.itemValues.map((ele, index) => {
                if(!ele){
                    this.$set(this.itemValues, index, _data[index])
                }
            })
            this.$emit('update-block', this.section);
        },
        onSearchInputChange(prop, searchObj, idx) {
            let obj = {
                type: prop.id,
                value: searchObj.value,
                idx: idx
            }
            this.$emit('search-input', obj);
        },
        onBlockSelectionOutsideClick() {
            this.showAvailableBlocksSelectionPopup = false;
        },
        onBlocksListChange() {
            this.$emit('update-block', this.section);
        },
        onBlockClick(block) {
            this.$set(block, 'expand', !block.expand);
        },
        removeBlock(index) {
            if(this.section.blocks) {
                this.section.blocks = this.section.blocks.filter(
                    (b, i) => i != index
                );
            }
            this.$emit('update-block', this.section);
        },
        onBlockInputChange(block, prop, value) {
            block.props[prop.id] = value;
            this.$emit('update-block', this.section);
        },
        onAddButtonClick() {
            if (
                this.section_schema.blocks &&
                this.section_schema.blocks.length
            ) {
                if (this.section_schema.blocks.length > 1) {
                    this.showAvailableBlocksSelectionPopup = !this
                        .showAvailableBlocksSelectionPopup;
                } else {
                    this.addBlock(this.section_schema.blocks[0]);
                }
            }
        },
        onBlockOptionClick(blockSchema) {
            this.addBlock(blockSchema);
            this.showAvailableBlocksSelectionPopup = false;
        },
         addBlock(blockSchema, isPreset = false) {
            if (!this.section.blocks) {
                this.$set(this.section, 'blocks', []);
            }
            this.section.blocks.push({
                type: blockSchema.type,
                name: blockSchema.name,
                expand: !isPreset,
                props: blockSchema.props.reduce((a, p) => {
                    a[p.id] = {
                        type: p.type,
                        value: p.default,
                    };
                    return a;
                }, {}),
            });
            if (!isPreset) this.$emit('update-block', this.section);
        },
        getBlocks() {
            //if there are blocks return
            if (this.section_schema) {
                if (this.section.blocks && this.section.blocks.length > 0)
                    return this.section.blocks;
                //else create blocks using preset
                if (
                    this.section_schema.preset &&
                    this.section_schema.preset.blocks
                ) {
                    console.log('getting blocks with presets');

                    this.section_schema.preset.blocks.map((block) => {
                        let blockSchema = this.section_schema.blocks.find(
                            (b) => b.name === block.name
                        );
                        this.addBlock(blockSchema, true);
                    });
                }
            }
        },
        onMove() {
            //check if first move
            //track temperory position of the element being dragged
            //if first move then original index
            //else use index stored
            // this.movingIndex =
            //     this.movingIndex === -1
            //         ? e.draggedContext.index
            //         : this.movingIndex;
            // const data = {
            //     index: this.movingIndex,
            //     newIndex: e.draggedContext.futureIndex,
            // };
            // this.postMessageToIframe(
            //     PREVIEW_EVENTS.DRAGGING_SECTION,
            //     data
            // );
            //assign temp moving index
            // this.movingIndex = e.draggedContext.futureIndex;
        },
        onChange() {
            // let { added, removed, moved } = d;
        },
        dragStart() {
            // this.$emit('zoom-out');
            // setTimeout(() => {
            //     this.postMessageToIframe(
            //         PREVIEW_EVENTS.DRAG_SECTION_START,
            //         {
            //             index,
            //         }
            //     );
            // }, 100);
        },
        dragStop() {
            // this.dragging = false;
            // this.postMessageToIframe(
            //     PREVIEW_EVENTS.DRAG_SECTION_END, 
            //     {
            //         index: this.movingIndex,
            //     }
            // );
            // this.movingIndex = -1;
            // this.$emit('zoom-in');
        },
        removeItem() {
            // this.mSections.splice(index, 1)
            // this.selectedSectionIndex = -1;
            // this.postMessageToIframe(
            //     PREVIEW_EVENTS.REMOVE_SECTION, 
            //     {
            //         removedIndex: index,
            //     }
            // );
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
