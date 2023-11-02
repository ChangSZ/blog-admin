<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form/>
          <p class="login-tip"><a href="https://github.com/ChangSZ">https://github.com/ChangSZ</a></p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '../../components/login-form'
export default {
  components: {
    LoginForm
  },
  methods: {
  }
}
</script>

<style>

</style>
