<template>
    <div :class="`mirage-alert mirage-alert-${type}`" v-show="visible">
        <div v-if="showIcon">
            <adm-inline-svg
                class="alert-box-icon"
                :src="type"
            ></adm-inline-svg>
        </div>
        <slot></slot>
        <span @click="close" class="close-alert">
            <inline-svg v-if="dismissible" src="cross-black"></inline-svg>
        </span>
    </div>
</template>

<script>
import admInlineSvg from '@/components/common/inline-svg.vue';
export default {
    name: 'mirage-alert',
    components: {
        'adm-inline-svg': admInlineSvg,
    },
    props: {
        type: {
            type: String,
            default: 'info',
            validator: (value) => {
                return [
                    'info',
                    'warning',
                    'success',
                    'error',
                    'plain',
                ].includes(value);
            },
        },
        dismissible: {
            type: Boolean,
            default: false,
        },
        showIcon: {
            type: Boolean,
            default: false,
        },
    },
    data: function () {
        return { visible: true };
    },
    methods: {
        close() {
            this.visible = false;
            this.$emit('close');
        },
    },
};
</script>

<style lang="less" scoped>
.mirage-alert {
    border-radius: 3px;
    padding: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 20px;

    .alert-box-icon {
        margin-right: 12px;
        ::v-deep svg {
            height: 20px;
            width: 20px;
        }
    }
    .close-alert {
        ::v-deep svg {
            #prefix__Imported-Layers-Copy-6 {
                stroke-width: 2;
            }
        }
    }
}
.mirage-alert-warning {
    background-color: #fffaf0;
    color: #f5a300;
    border: 1px solid #f5a300;
    .close-alert {
        ::v-deep svg {
            #prefix__Imported-Layers-Copy-6 {
                stroke: #f5a300;
            }
        }
    }
}
.mirage-alert-info {
    background-color: #ebedfb;
    color: @RoyalBlue;
    border: 1px solid @RoyalBlue;
    .close-alert {
        ::v-deep svg {
            #prefix__Imported-Layers-Copy-6 {
                stroke: @RoyalBlue;
            }
        }
    }
}
.mirage-alert-plain {
    background-color: white;
    color: @RoyalBlue;
    border: 1px solid @RoyalBlue;
    .close-alert {
        ::v-deep svg {
            #prefix__Imported-Layers-Copy-6 {
                stroke: @RoyalBlue;
            }
        }
    }
}
.mirage-alert-success {
    background-color: #e6fff0;
    color: #00c853;
    border: 1px solid #00c853;
    .close-alert {
        ::v-deep svg {
            #prefix__Imported-Layers-Copy-6 {
                stroke: #00c853;
            }
        }
    }
}
.mirage-alert-error {
    background-color: #ffdde0;
    color: #fa3f4d;
    border: 1px solid #fa3f4d;
    .close-alert {
        ::v-deep svg {
            #prefix__Imported-Layers-Copy-6 {
                stroke: #fa3f4d;
            }
        }
    }
}
.close-alert {
    display: inline-block;
    cursor: pointer;
    position: relative;
    right: 0;
    height: 20px;
    ::v-deep svg {
        width: 20px;
        height: 20px;
    }
}
</style>
