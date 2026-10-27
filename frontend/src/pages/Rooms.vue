<script setup>
import { ref, onMounted } from 'vue';
import { client } from '../lib/client';

const rooms = ref([]);
const loading = ref(false);

const load = async () => {
  loading.value = true;
  try {
    const res = await client.get('/rooms');
    rooms.value = res.data.data;
  } catch (err) {
    alert(err.response?.data?.message || 'Gagal memuat ruangan');
  } finally {
    loading.value = false;
  }
};

onMounted(load);

const del = async (id) => {
  if (!confirm('Yakin ingin menghapus ruangan ini?')) return;
  try {
    await client.delete(`/rooms/${id}`);
    load();
  } catch (err) {
    alert(err.response?.data?.message || 'Gagal menghapus ruangan');
  }
};
</script>

<template>
  <div class="l-wrap">
    <div class="l-sidebar-article"></div>
    <div class="l-main-article">
      <router-link to="/rooms/create" class="button">
        Add New Room
      </router-link>

      <h2>School Rooms List</h2>

      <div v-if="loading" style="text-align: center; padding: 2rem;">
        Loading data...
      </div>

      <div v-else-if="rooms.length === 0" style="text-align: center; padding: 2rem;">
        Belum ada data ruangan.
      </div>

      <table v-else>
        <thead>
          <tr>
            <th>ID</th>
            <th>Gedung</th>
            <th>No. Ruang</th>
            <th>Nama Ruangan</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in rooms" :key="r.id">
            <td>#{{ r.id }}</td>
            <td>{{ r.building }}</td>
            <td>{{ r.room_number }}</td>
            <td>{{ r.name }}</td>
            <td>
              <span :class="['badge', r.is_active ? 'badge-success' : 'badge-danger']">
                {{ r.is_active ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td>
              <router-link :to="`/rooms/${r.id}/edit`" class="button" style="margin-right: 4px;">Update</router-link>
              <button style="background: #dc3545;" @click="del(r.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
