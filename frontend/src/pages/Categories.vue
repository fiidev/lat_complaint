<script setup>
import { ref, onMounted } from 'vue';
import { client } from '../lib/client';

const categories = ref([]);
const loading = ref(false);

const load = async () => {
  loading.value = true;
  try {
    const res = await client.get('/complaint-categories');
    categories.value = res.data.data;
  } catch (err) {
    alert(err.response?.data?.message || 'Gagal memuat kategori');
  } finally {
    loading.value = false;
  }
};

onMounted(load);

const del = async (id) => {
  if (!confirm('Yakin ingin menghapus kategori ini?')) return;
  try {
    await client.delete(`/complaint-categories/${id}`);
    load();
  } catch (err) {
    alert(err.response?.data?.message || 'Gagal menghapus kategori');
  }
};
</script>

<template>
  <div class="l-wrap">
    <div class="l-sidebar-article"></div>
    <div class="l-main-article">
      <router-link to="/categories/create" class="button">
        Add New Category
      </router-link>

      <h2>Complaint Categories List</h2>

      <div v-if="loading" style="text-align: center; padding: 2rem;">
        Loading data...
      </div>

      <div v-else-if="categories.length === 0" style="text-align: center; padding: 2rem;">
        Belum ada kategori pengaduan.
      </div>

      <table v-else>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama Kategori</th>
            <th>Deskripsi Masalah</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in categories" :key="c.id">
            <td>#{{ c.id }}</td>
            <td><strong>{{ c.name }}</strong></td>
            <td>{{ c.description || '-' }}</td>
            <td>
              <router-link :to="`/categories/${c.id}/edit`" class="button" style="margin-right: 4px;">Update</router-link>
              <button style="background: #dc3545;" @click="del(c.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
