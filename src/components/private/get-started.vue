<template>
  <ul class="main-list">
    <li class="list-item">
      <h2 class="bold-xl cl-Mako title">Welcome to Fynd Partners</h2>
    </li>
  </ul>
</template>

<style lang="less" scoped>
.main-list {
  margin: 50px 0;
  color: @Mako;
  list-style: none;
  display: flex;
  justify-content: center;
  flex-direction: column;

  .list-item {
    display: block;
    position: relative;
    h2 {
      margin-bottom: 10px;
    }
  }
}
</style>

<script>
export default {
  name: 'invite-get-started'
}
</script>
