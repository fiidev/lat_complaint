import { createRouter, createWebHistory } from 'vue-router';

// Auth Pages
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';

// Siswa / Pelapor Pages
import MyComplaints from '../pages/MyComplaints.vue';
import AddComplaint from '../pages/AddComplaint.vue';

// Admin Complaints & Tickets Pages
import AdminComplaints from '../pages/AdminComplaints.vue';
import CreateTicket from '../pages/CreateTicket.vue';
import Reports from '../pages/Reports.vue';

// Staff Tickets Page
import StaffTickets from '../pages/StaffTickets.vue';

// Master Rooms Pages
import Rooms from '../pages/Rooms.vue';
import AddRoom from '../pages/AddRoom.vue';
import EditRoom from '../pages/EditRoom.vue';

// Master Categories Pages
import Categories from '../pages/Categories.vue';
import AddCategory from '../pages/AddCategory.vue';
import EditCategory from '../pages/EditCategory.vue';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    // 1. Group Guest (Belum Login)
    {
      path: '/',
      meta: { guest: true },
      children: [
        { path: 'login', component: Login },
        { path: 'register', component: Register },
      ],
    },

    // 2. Group Auth (Wajib Login)
    {
      path: '/',
      meta: { auth: true },
      children: [
        { path: '', redirect: '/my-complaints' },

        // Siswa
        { path: 'my-complaints', component: MyComplaints },
        { path: 'complaints/create', component: AddComplaint },

        // Admin Review & Assign
        { path: 'admin-complaints', component: AdminComplaints },
        { path: 'create-ticket', component: CreateTicket },
        { path: 'reports', component: Reports },

        // Staff
        { path: 'staff-tickets', component: StaffTickets },

        // Master Rooms
        { path: 'rooms', component: Rooms },
        { path: 'rooms/create', component: AddRoom },
        { path: 'rooms/:id/edit', component: EditRoom },

        // Master Categories
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
