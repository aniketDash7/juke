import UserRegistration from './components/UserRegistration.js'
import Welcome from './components/Welcome.js'
import UserLogin from './components/UserLogin.js'
import AdminLogin from './components/AdminLogin.js'
import Profile from './components/Profile.js'
import AllUsers from './components/AllUsers.js'
import AdminDashboard from './components/AdminDashboard.js'
import Account from './components/Account.js'

const routes = [

  { path: '/', component: Welcome, name: 'Welcome' },
  { path:'/userLogin', component: UserLogin, name:'UserLogin'},
  { path:'/userRegistration', component:UserRegistration, name:"UserRegistration"},
  { path:'/adminLogin', component:AdminLogin, name:"AdminLogin"},
  { path:'/profile/:id', component:Profile, name:"Profile"},
  { path:'/allUsers', component:AllUsers, name:"AllUsers"},
  { path:'/adminDashboard', component:AdminDashboard, name:"AdminDashboard"},
  { path:'/account/:id/:username', component:Account, name:"Account"},

]

export default new VueRouter({
  routes,
})