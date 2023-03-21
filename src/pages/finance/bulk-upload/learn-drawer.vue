<template>
    <div class="learn-overlay">
         
        <div class="learn-drawer-wrap">

        <div class="drawer-inner-wrap">
            <div class="header">
                <div class="header-title">Learn More</div>
                <div class="cross-btn" @click="closeDrawer">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" fill="#8F8F8F"/>
                    </svg>
                </div>
            </div>
            <div class="content-wrap">
                <div class="main-title">Learn to use upload data portal in just 3 simple steps</div>
                <ul class="list-wrap">
                    <li>
                        <div class="num">1</div>
                        <div class="title">Download the sample file</div>
                        <div class="desc">Apply the suitable filters, click on “Download Template” button and choose the file type you want to download. The download will start soon after you choose the desired file type.</div>
                    </li>
                    <li>
                        <div class="num">2</div>
                        <div class="title">Edit the file and save</div>
                        <div class="desc">Once the template file is downloaded, read the instructions, follow the exact mentioned steps and fill in the columns in the file. Save the file when you are done.</div>
                    </li>
                    <li>
                        <div class="num">3</div>
                        <div class="title">Upload the file</div>
                        <div class="desc">Go back to the “Bulk Action” section and click on “Select a file” option. Select the saved template file from your computer and the upload shall start soon.</div>
                    </li>
                </ul>
            </div>
            
        </div>
        </div>
    </div>
</template>
<script>
export default {
name: 'learn-drawer',

methods: {
        closeDrawer(){
            this.$emit('closeDrawer')
        },
    }


}
</script>
<style lang="less" scoped>
.learn-overlay{position: absolute;
    height: 100%;
    position: fixed;
    top: 0;
    right: 0;
    width: 100%;
    background: rgba(51, 51, 51, 0.7);
    z-index: 100;

.learn-drawer-wrap{

position: absolute;
height: 100%;
background:#fff;
top: 0;
right: 0;
max-width: 384px;
width: 100%;

.drawer-inner-wrap{ 
    height: 100%;
    box-sizing: border-box;
}

.header{
    padding:24px;
    border-bottom: 1px solid #E0E0E0;
    display: flex; align-items: center;
    justify-content: space-between;

    .header-title{
    color: #41434C;
    font-size: 20px;
    line-height: 25px;
    font-weight: 700; 
}
    .cross-btn{
        cursor: pointer;
    }

}

.content-wrap{
padding: 24px;
.main-title{
font-weight: 500;
font-size: 18px;
line-height: 23px;
color: #41434C;
padding-bottom: 27px;
}

.list-wrap{
    

    li{
        padding: 0px 10px 27px 21px;
        margin-left:12px;
        border-left:  1.5px solid #E0E0E0;
        position: relative;

        .num{
        color: #2E31BE;
        font-size: 14px;
        background: #F8F8F8;
        height: 24px;
        line-height: 24px;
        width: 24px;
        text-align: center;
        position: absolute;
        top: 0;
        left: -12px;
        border-radius: 50%;
    }

    .title{
        font-weight: 600;
        font-size: 14px;
        line-height: 19px;
        color: #41434C;
        padding: 2px 0 7px;
    }

    .desc{
        font-size: 14px;
        line-height: 19px;
        color: #9B9B9B;
    }

    }

    li:last-child {
        border-left:  none;
    }

    
}

}


}



}
</style>