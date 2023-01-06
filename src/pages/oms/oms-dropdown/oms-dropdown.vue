<template>
    <div class="oms-dropdown" @blur="onBlur" :style="css">
        <span class="label" v-if="label.length">Label</span>
        <div class="dropdown-box" @click="toggleDisplay">
            <span class="placeholder-text">
                {{ placeholder }}
            </span>
            <inline-svg 
                class="oms-dropdown-arrow"
                :src="showItems ? 'accordion-arrow-up': 'accordion-arrow-down'" />
        </div>
        <div class="oms-dropdown-items-container" v-if="showItems">
            <div class="oms-dropdown-items-wrapper" v-if="items.length">
                <div 
                    class="oms-dropdown-item"
                    v-for="(item, index) in items"
                    :key="item.value"
                    @click="event => onItemClick(item, index, event)">
                    <inline-svg :src="item.icon" v-if="item.icon" class="oms-dropdown-item-icon" />
                    <span class="oms-dropdown-item-text">{{ item.text }}</span>
                </div>
            </div>
            <div class="no-items" v-if="items.length === 0">
                <div class="oms-dropdown-item">
                    No {{ label ? label : 'item' }}s found
                </div>
            </div>
        </div>
    </div>
</template>

<script>
/**
 * A custom dropdown used for the OMSv2.1 scenario.
 * 
 * The required props for this component is the "items" array which
 * will power the dropdown. It should be an array of objects where
 * every object refers to an option in the dropdown. Every object
 * should have a mandatory "text" and a "value". "text" will be
 * the display text for the option while "value" will be the unique
 * identification of the option.
 * 
 * The optional props for this component include:
 * a) css: To add a custom styling to the component. It follows the
 *         inline CSS style (e.g. {color: "white"})
 * b) label: The text label that will be shown on top of the dropdown.
 *           It will be used to visually identify the dropdown.
 * c) placeholder: The text that will be shown inside the box of
 *                 dropdown. Be default, it will be shown as 'Select'.
 * 
 * @author Rushabh Mulraj Shah <rushabhmshah@gofynd.com>
 * @version 1.0.0
 */

/* Component imports */
import InlineSvg from '@/components/common/inline-svg.vue';

export default {
    name: 'oms-dropdown',
    components: {
        'inline-svg': InlineSvg
    },
    props: {
        css: {
            type: Object,
            default: () => {}
        },
        items: {
            type: Array,
            required: true,
            default: []
        },
        label: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: 'Select'
        }
    },
    data() {
        return {
            showItems: false
        }
    },
    methods: {
        /**
         * Method to hide all the options.
         * 
         * @author Rushabh Mulraj Shah <rushabhmshah@gofynd.com>
         * @since 1.0.0
         */
        close() {
            this.showItems = false;
        },

        /**
         * Method when the component goes out of focus.
         * 
         * @author Rushabh Mulraj Shah <rushabhmshah@gofynd.com>
         * @since 1.0.0
         */
        onBlur() {
            this.close();
        },

        /**
         * The event-listener method to handle clicking of a dropdown option.
         * It will close the dropdown after the user selects a dropdown option.
         * 
         * @author Rushabh Mulraj Shah <rushabhmshah@gofynd.com>
         * @param {Object} item The data sent by the user in props for an individual option.
         * @param {Number} index The index or the position of the option amongst all items.
         * @param {Object} event The actual native event.
         * @since 1.0.0
         */
        onItemClick(item, index, $event) {
            this.$emit(
                'change',
                {
                    event: $event,
                    item: item,
                    index: index
                }
            );
            this.close();
        },

        /**
         * Method to show all the options.
         * 
         * @author Rushabh Mulraj Shah <rushabhmshah@gofynd.com>
         * @since 1.0.0
         */
        open() {
            this.showItems = true;
        },

        /**
         * Method to toggle (show/hide) all the options.
         * 
         * @author Rushabh Mulraj Shah <rushabhmshah@gofynd.com>
         * @since 1.0.0
         */
        toggleDisplay() {
            this.showItems = !this.showItems;
        }
    }
}
</script>

<style lang="less" scoped>
.oms-dropdown {
    position: relative;

    .label {
        font-weight: 400;
        font-size: 12px;
        line-height: 23px;
        color: #41343C;
        opacity: .5;
        margin-bottom: 5px;
    }

    .dropdown-box {
        border: 1px solid #2E31BE;
        border-radius: 3.86px;
        height: 30px;
        min-width: 150px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 4px 12px;
        font-size: 12px;

        .placeholder-text {
            font-weight: 700;
            font-size: 12px;
            line-height: 20px;
            color: #2E31BE;
        }

        .oms-dropdown-arrow {
            height: 10px;
            width: 12px;

            ::v-deep svg {
                stroke: #2E31BE;
                stroke-width: 1%;
            }
        }
    }

    .oms-dropdown-items-container {
        background: #FFFFFF;
        border: 1px solid #E0E0E0;
        box-shadow: 0px 9px 24px rgba(0, 0, 0, 0.07);
        border-radius: 4px;
        transition: display 1s ease-in-out 1s;
        max-height: 300px;
        overflow-y: auto;
        position: absolute;
        top: calc(30px + 4px + 4px + 4px);
        row-gap: 1rem;
        width: 100%;
        box-sizing: border-box;
        z-index: 3; 

        .oms-dropdown-item {
            display: flex;
            padding: 12px;

            &:last-child {
                margin-bottom: 0;
            }

            &:hover {
                background: #E7EEFF;
                color: #2E31BE;

                ::v-deep svg {
                    fill: #2E31BE;
                    stroke: #2E31BE;
                }
            }

            .oms-dropdown-item-icon {
                height: 15px;
                width: 15px;
                margin-right: 10px;
            }
        }
    }
}
</style>
