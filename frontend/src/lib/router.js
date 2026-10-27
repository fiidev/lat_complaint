import { createRouter, createWebHistory } from 'vue-router';

import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';
import MyComplaints from '../pages/MyComplaints.vue';
import AddComplaint from '../pages/AddComplaint.vue';
import AdminComplaints from '../pages/AdminComplaints.vue';
import CreateTicket from '../pages/CreateTicket.vue';
import Reports from '../pages/Reports.vue';
import StaffTickets from '../pages/StaffTickets.vue';
import Rooms from '../pages/Rooms.vue';
import AddRoom from '../pages/AddRoom.vue';
import EditRoom from '../pages/EditRoom.vue';
import Categories from '../pages/Categories.vue';
import AddCategory from '../pages/AddCategory.vue';
import EditCategory from '../pages/EditCategory.vue';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      meta: { guest: true },
      children: [
        { path: 'login', component: Login },
        { path: 'register', component: Register },
      ],
    },

    {
      path: '/',
      meta: { auth: true },
      children: [
        { path: '', redirect: '/my-complaints' },
        { path: 'my-complaints', component: MyComplaints },
        { path: 'complaints/create', component: AddComplaint },
        { path: 'admin-complaints', component: AdminComplaints },
        { path: 'create-ticket', component: CreateTicket },
        { path: 'reports', component: Reports },
        { path: 'staff-tickets', component: StaffTickets },
        { path: 'rooms', component: Rooms },
        { path: 'rooms/create', component: AddRoom },
        { path: 'rooms/:id/edit', component: EditRoom },
        { path: 'categories', component: Categories },
        { path: 'categories/create', component: AddCategory },
        { path: 'categories/:id/edit', component: EditCategory },
      ],
    },

    { path: '/:pathMatch(.*)*', redirect: '/login' },
  ],
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (to.meta.auth && !token) return next('/login');
  if (to.meta.guest && token) {
    if (role === 'admin') return next('/admin-complaints');
    if (role === 'staff') return next('/staff-tickets');
    return next('/my-complaints');
  }

  next();
});
