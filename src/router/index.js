import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '../store'
import iView from 'iview'

Vue.use(Router);
const router = new Router({
  routes,
  mode: 'history'
});


const LOGIN_PAGE_NAME = 'login';  // 登陆页name
const REGISTER_PAGE_NAME = 'register';  // 注册页name

router.beforeEach((to, from, next) => {

  /**
 * @description 需要登陆页token或cookie认证代码参考如下
 */
  iView.LoadingBar.start();  // 开启loading
  const token = store.getters['auth/token'];  // 获得token getToken方法自定义

  if (!token && to.name !== LOGIN_PAGE_NAME && to.name !== REGISTER_PAGE_NAME) {
    // 未登录且要跳转的页面不是登录页
    next({
      name: LOGIN_PAGE_NAME // 跳转到登录页
    })
  } else if (!token && (to.name === LOGIN_PAGE_NAME || to.name === REGISTER_PAGE_NAME)) {
    // 未登陆且要跳转的页面是登录页
    next() // 跳转
  } else if (token && to.name === LOGIN_PAGE_NAME) {
    // 已登录且要跳转的页面是登录页
    next({
      name: 'home' // 跳转到homeName页
    })
  }
  next()
});

router.afterEach(to => {
  // 如果beforeEach里开启loading则关闭
  iView.LoadingBar.finish();
  window.scrollTo(0, 0);
});


export default router
