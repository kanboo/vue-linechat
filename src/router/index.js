import Vue from 'vue';
import Router from 'vue-router';

// 載入頁面元件
import ChatRoom from '@/components/ChatRoom';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'ChatRoom',
      component: ChatRoom
    },
    {
      path: '*',
      name: 'ChatRoom',
      component: ChatRoom
    }
  ]
});
