<template>
    <div class="default-footer">
        <section class="footer-link">
            <div class="about-us">
                <div class="logo">
                    <img
                        src="/public/assets/pngs/admin.png"
                        alt="[Platform Admin Logo]"
                    />
                </div>
                <div class="desc">
                    Fynd Platform Admin Console is where internal users can
                    manage Company, Product, Platform configurations and take
                    day-to-day actions to help businesses sell smoothly with
                    Fynd.
                </div>
            </div>
        </section>
        <footer>
            <div class="copyright">
                #MadeInIndia | &copy; {{ new Date().getFullYear() }} Shopsense
                Retail Technologies
            </div>
            <!-- <div class="social">
                <a href="https://www.facebook.com/gofynd" target="_blank" title="Facebook">
                    <img src="/public/assets/svgs/social/facebook.svg" />
                </a>
                <a href="https://www.twitter.com/GoFynd" target="_blank" title="Twitter">
                    <img src="/public/assets/svgs/social/twitter.svg" />
                </a>
                <a href="https://www.instagram.com/gofynd/" target="_blank" title="Instafram">
                    <img src="/public/assets/svgs/social/instagram.svg" />
                </a>
                <a
                    href="https://www.youtube.com/channel/UCk0fmGcZYDwGk_8mD4DE5Gg/featured"
                    target="_blank"
                    title="YouTube"
                >
                    <img src="/public/assets/svgs/social/youtube.svg" />
                </a>
                <a href="https://www.pinterest.com/gofynd/" target="_blank" title="Pinterest">
                    <img src="/public/assets/svgs/social/pinterest.svg" />
                </a>
                <a
                    href="https://www.linkedin.com/company/fynd-shopsense/"
                    target="_blank"
                    title="Linked In"
                >
                    <img src="/public/assets/svgs/social/linkedin.svg" />
                </a>
            </div>-->
        </footer>
    </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
section.footer-link {
    padding: 20px 0;
    .about-us {
        display: flex;
        color: @DustyGray2;
        .logo {
            width: 15%;
            padding-left: 20px;
            img {
                width: 144px;
                height: 65px;
            }
        }
        .desc {
            width: 75%;
            font-size: 14px;
            line-height: 21px;
        }
        .links {
            width: 35%;
            display: flex;
            justify-content: space-evenly;
        }
    }
}
footer {
    display: flex;
    height: 40px;
    padding: 20px 0;
    width: 100%;
    border-top: 1px solid @Iron;

    max-width: 1400px;
    .copyright {
        font-size: 12px;
        line-height: 40px;
        color: @DustyGray2;
        margin-left: 20px;
    }
    .social {
        display: flex;
        flex: 1;
        justify-content: flex-end;
        margin-right: 20px;
        a {
            margin: 0 5px;
        }
        .link {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin: 0 10px;
            background-color: @DustyGray2;
        }
    }
}
</style>
