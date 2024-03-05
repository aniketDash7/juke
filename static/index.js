import router from './router.js'


// router.beforeEach((to,from,next)=>{
//   if (to.name !== 'UserLogin' && !localStorage.getItem('auth-token') ? true : false) next({name:'UserLogin'})
//   else next()
// })

// router.beforeEach((to,from,next)=>{
//   if(to.name !== 'AdminLogin' && !localStorage.getItem('auth-token') ? true : false) next({name:'AdminLogin'})
//   else next()
// })

new Vue({
  el: '#app',

  template :`<router-view class="m-5"/>`,
  router,


})