<template>
  <div class="default-footer">
    <section class="footer-link">
      <div class="about-us">
        <div class="logo">
          <img src="/public/assets/pngs/fynd.png" alt="[PROJECT_LOGO]" />
        </div>
        <div class="desc">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque,
          exercitationem ipsa? Omnis distinctio temporibus sed aut,
          reprehenderit quisquam totam. Et laborum voluptates veritatis nostrum
          expedita nemo doloribus dolor ratione perspiciatis?
        </div>
        <div class="links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Contact Us</a>
          <a href="#">FAQs</a>
        </div>
      </div>
    </section>
    <footer>
      <div class="copyright">
        #MadeInIndia | &copy; {{ new Date().getFullYear() }} Shopsense Retail
        Technologies
      </div>
      <div class="social">
        <!-- TODO: fix this using recursive svg gen -->
        <a
          href="https://www.facebook.com/gofynd"
          target="_blank"
          title="Facebook"
        >
          <img src="/public/assets/svgs/social/facebook.svg" />
        </a>
        <a
          href="https://www.twitter.com/GoFynd"
          target="_blank"
          title="Twitter"
        >
          <img src="/public/assets/svgs/social/twitter.svg" />
        </a>
        <a
          href="https://www.instagram.com/gofynd/"
          target="_blank"
          title="Instafram"
        >
          <img src="/public/assets/svgs/social/instagram.svg" />
        </a>
        <a
          href="https://www.youtube.com/channel/UCk0fmGcZYDwGk_8mD4DE5Gg/featured"
          target="_blank"
          title="YouTube"
        >
          <img src="/public/assets/svgs/social/youtube.svg" />
        </a>
        <a
          href="https://www.pinterest.com/gofynd/"
          target="_blank"
          title="Pinterest"
        >
          <img src="/public/assets/svgs/social/pinterest.svg" />
        </a>
        <a
          href="https://www.linkedin.com/company/fynd-shopsense/"
          target="_blank"
          title="Linked In"
        >
          <img src="/public/assets/svgs/social/linkedin.svg" />
        </a>
        <!-- <inline-svg src="social/facebook" /> -->
      </div>
    </footer>
  </div>
</template>

<script>
export default {}
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
    }
    .desc {
      width: 50%;
      font-size: 14px;
      line-height: 21px;
    }
    .links {
      width: 35%;
      display: flex;
      justify-content: space-evenly;
      a {
      }
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
