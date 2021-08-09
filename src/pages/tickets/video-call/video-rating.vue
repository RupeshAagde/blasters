<template>
    <div class="rating-container">
        <div class="top-header">
            <div style="padding:14px" @click="done">
                <ukt-inline-svg :src="'cross-white'"></ukt-inline-svg>
            </div>
            <div>
                Rate your experience
            </div>
        </div>
        <div class="rating-view">
            <div class="title">Overall call experience</div>
            <div class="rating-buttons">
                <div
                    v-for="index in [1, 2, 3, 4, 5]"
                    :key="index"
                    @click="rating = index"
                    style="margin-right:12px"
                >
                    <ukt-inline-svg
                        :src="'star-rating'"
                        v-bind:class="[{ on: rating >= index }]"
                    ></ukt-inline-svg>
                </div>
            </div>
            <hr style="border-top: 1px solid #c9c9c9; margin-bottom: 24px" />
            <div class="sub-title">How was your audio quality?</div>
            <div class="rating-buttons rating-buttons-smaller">
                <div
                    v-for="index in [1, 2, 3, 4, 5]"
                    :key="index"
                    @click="audioRating = index"
                    style="margin-right:9px"
                >
                    <ukt-inline-svg
                        :src="'star-rating'"
                        v-bind:class="[{ on: audioRating >= index }]"
                    ></ukt-inline-svg>
                </div>
            </div>
            <div class="sub-title">How was your video quality?</div>
            <div class="rating-buttons rating-buttons-smaller">
                <div
                    v-for="index in [1, 2, 3, 4, 5]"
                    :key="index"
                    @click="videoRrating = index"
                    style="margin-right:9px"
                >
                    <ukt-inline-svg
                        :src="'star-rating'"
                        v-bind:class="[{ on: videoRrating >= index }]"
                    ></ukt-inline-svg>
                </div>
            </div>
            <textarea
                v-model="feedback"
                class="feedback-textarea"
                placeholder="Tell us what you liked"
            ></textarea>
            <div @click="done" class="submit-button">
                Submit Feedback
            </div>
        </div>
    </div>
</template>

<script>
import admInlineSvg from '@/components/common/adm-inline-svg';
import SupportService from '@/services/support.service';

export default {
    name: 'video-rating',
    data() {
        return {
            rating: 0,
            audioRating: 0,
            videoRrating: 0,
            feedback: ''
        };
    },
    components: {
        'ukt-inline-svg': admInlineSvg
    },
    methods: {
        done() {
            SupportService.rateVideo(
                this.$route.params.ticket_id,
                {
                    value: {
                        ratings: [
                            {
                                key: 'overall',
                                title: 'Overall',
                                rating: this.rating
                            },
                            {
                                title: 'Audio',
                                key: 'audio',
                                rating: this.audioRating
                            },
                            {
                                title: 'Video',
                                key: 'video',
                                rating: this.videoRrating
                            }
                        ],
                        feedback: this.feedback
                    },
                    type: 'rating'
                }
            )
                .then(res => {
                    // Nothing to do
                })
                .catch(err => {
                    console.log(err);
                });
            this.$emit(`done`, {
                rating: this.rating,
                feedback: this.feedback
            });
        }
    },
    mounted() {
        //
    },
    destroyed() {
        //
    }
};
</script>

<style lang="less" scoped>
.rating-container {
    padding: 20px;
    text-align: center;
    height: 100%;
    box-sizing: border-box;
    background-color: white;
    @media @mobile {
        text-align: left;
        padding: 0px;
    }

    .top-header {
        display: none;
        @media @mobile {
            height: 50px;
            background-color: #2036de;
            color: white;
            display: flex;
            justify-content: left;
            align-items: center;
            z-index: 3;
        }
    }

    .rating-view {
        display: inline-block;
        box-sizing: border-box;
        box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.3),
            0 2px 6px 2px rgba(60, 64, 67, 0.15);
        background: #fff;
        border-radius: 8px;
        padding: 16px;
        min-width: 520px;
        margin-top: 100px;

        @media @mobile {
            margin-top: 0px;
            width: 100%;
            box-shadow: none;
            min-width: 0px;
            border-radius: 0px;
        }

        .title {
            color: #41434c;
            font-size: 15px;
            font-weight: 700;
            margin-bottom: 18px;
        }

        .sub-title {
            color: #908f8f;
            font-size: 13px;
            font-weight: 300;
            margin-bottom: 15px;
        }

        .rating-buttons {
            display: flex;
            justify-content: center;
            margin-bottom: 24px;

            @media @mobile {
                justify-content: left;
            }

            ::v-deep svg {
                width: 30px;
                height: 30px;
            }

            .on {
                ::v-deep svg {
                    #prefix__Group {
                        fill: #fcc301;
                    }
                }
            }
        }

        .rating-buttons-smaller {
            ::v-deep svg {
                width: 21px;
                height: 21px;
            }
        }

        .feedback-textarea {
            margin: 0px;
            height: 100px;
            width: 75%;
            resize: none;
            margin-bottom: 20px; // 24
            border: 1px #e0e0e0 solid;
            border-radius: 4px;
            padding: 8px;
            box-sizing: border-box;
            color: #41434c;
            @media @mobile {
                width: 100%;
            }
            -webkit-appearance: none;
        }

        textarea::placeholder {
            color: #9b9b9b;
        }

        .submit-button {
            height: 40px;
            background: #2036de;
            color: #fff;
            border: 1px #e8eaed solid;
            box-sizing: border-box;
            line-height: 30px;
            width: fit-content;
            padding: 4px 20px;
            margin: auto;
            border-radius: 4px;
            text-align: center;
            font-size: 15px;
            font-weight: 700;
            @media @mobile {
                width: auto;
                position: absolute;
                bottom: 16px;
                right: 16px;
                left: 16px;
            }
        }
    }
}
</style>
