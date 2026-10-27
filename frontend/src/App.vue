<script setup>
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { client } from './lib/client';

const router = useRouter();
const route = useRoute();

const user = ref(JSON.parse(localStorage.getItem('user') || 'null'));

watch(() => route.path, () => {
  user.value = JSON.parse(localStorage.getItem('user') || 'null');
});

const logout = async () => {
  try {
    await client.post('/auth/logout');
  } catch (err) {
  } finally {
    localStorage.clear();
    user.value = null;
    router.push('/login');
  }
};
</script>

<template>
  <div>
    <div v-if="user" class="top-bar">
      <router-link to="/" class="brand">
        School Complaint System
      </router-link>

      <div class="nav-links">
        <!-- Menu Admin -->
        <template v-if="user.role === 'admin'">
          <router-link to="/rooms">Rooms</router-link>
          <router-link to="/categories">Categories</router-link>
          <router-link to="/admin-complaints">Review Complaints</router-link>
          <router-link to="/reports">Reports</router-link>
        </template>

        <!-- Menu Staff -->
        <template v-else-if="user.role === 'staff'">
          <router-link to="/staff-tickets">My Assigned Tickets</router-link>
        </template>

        <!-- Menu Siswa / Pelapor -->
        <template v-else>
          <router-link to="/my-complaints">My Complaints</router-link>
          <router-link to="/complaints/create">+ Submit Complaint</router-link>
        </template>

        <a @click.prevent="logout" href="#" style="cursor: pointer; color: #ffcdd2;">Logout</a>
      </div>
    </div>
    <router-view />
  </div>
</template>
