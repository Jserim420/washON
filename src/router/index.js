import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import JoinView from "../views/JoinView.vue"
import MyPage from "../views/MyPage.vue"
import ReserveView from "../views/ReserveView.vue"
import LoginView from "../views/LoginView.vue"
import JoinManagerView from "../views/JoinManagerView.vue"
import ManagerPage from "../views/ManagerPage.vue"

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/mypage',
    component: MyPage
  },
  {
    path: '/mypage/manager',
    component: ManagerPage
  },
  {
    path: '/login',
    component: LoginView
  },
  {
    path: '/join',
    component: JoinView
  },
  {
    path: '/join/manager',
    component: JoinManagerView
  },
  {
    path: '/reserve',
    component: ReserveView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
