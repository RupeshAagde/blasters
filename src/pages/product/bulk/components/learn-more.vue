<template>
    <div class="main-content">
        <p class="cl-Mako darker-md title">
            Learn to use bulk import in just 3 simple steps
        </p>
        <div class="container">
            <div class="step completed">
                <div class="v-stepper">
                    <div class="circle"><span class="count">1</span></div>
                    <div class="line"></div>
                </div>

                <div class="content">
                    <p class="darker-xxs cl-Mako step-title">
                        Download the sample file
                    </p>
                    <p class="regular-xxs cl-DustyGray2 details">
                        Apply the suitable filters, click on “Download Template”
                        button and choose the file type you want to download.
                        The download will start soon after you choose the
                        desired file type.
                    </p>
                </div>
            </div>

            <div class="step">
                <div class="v-stepper">
                    <div class="circle"><span class="count">2</span></div>
                    <div class="line"></div>
                </div>

                <div class="content">
                    <p class="darker-xxs cl-Mako step-title">
                        Edit the file and save
                    </p>
                    <p class="regular-xxs cl-DustyGray2 details">
                        Once the template file is downloaded, read the
                        instructions, follow the exact mentioned steps and fill
                        in the columns in the file. Save the file when you are
                        done.
                    </p>
                </div>
            </div>

            <div class="step">
                <div class="v-stepper">
                    <div class="circle"><span class="count">3</span></div>
                    <div class="line"></div>
                </div>

                <div class="content">
                    <p class="darker-xxs cl-Mako step-title">
                        Upload the file
                    </p>
                    <p class="regular-xxs cl-DustyGray2 details">
                        Go back to the “Bulk Action” section and click on
                        “Select a file” option. Select the saved template file
                        from your computer and the upload shall start soon.
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'learn-more',
    props: {},
    mounted() {},
    data() {
        return {};
    },
    methods: {}
};
</script>

<style lang="less" scoped>
.main-content {
    margin: 24px;

    .container {
        margin-top: 24px;
    }
}

.step {
    padding-bottom: 24px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;

    background-color: cream;
}

.v-stepper {
    position: relative;
}

.step .circle {
    background-color: #f8f8f8;
    border-radius: 100%;
    width: 24px;
    height: 24px;
    display: inline-block;
    text-align: center;
    position: relative;

    .count {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: @RoyalBlue;
        font-weight: 600;
        font-size: 14px;
    }
}

.step .line {
    top: 24px;
    left: 12px;
    height: 100%;
    position: absolute;
    border-left: 1.5px solid #e0e0e0;
}

.step:last-child .line {
    border-left: 3px solid white;
    z-index: -1; /* behind the circle to completely hide */
}

.content {
    margin-left: 20px;
    display: inline-block;

    .step-title {
        line-height: 150%;
    }

    .details {
        line-height: 150%;
    }
}
</style>
