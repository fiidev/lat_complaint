<script setup>
import { ref, onMounted } from 'vue';
import { client } from '../lib/client';

const complaints = ref([]);
const loading = ref(false);

const load = async () => {
  loading.value = true;
  try {
    const res = await client.get('/me/complaints');
    complaints.value = res.data.data;
  } catch (err) {
    alert(err.response?.data?.message || 'Gagal memuat pengaduan');
  } finally {
    loading.value = false;
  }
};

onMounted(load);
</script>

<template>
  <div class="l-wrap">
    <div class="l-sidebar-article"></div>
    <div class="l-main-article">
      <router-link to="/complaints/create" class="button">
        Submit New Complaint
      </router-link>

      <h2>My Submitted Complaints</h2>

      <div v-if="loading" style="text-align: center; padding: 2rem;">
        Loading data...
      </div>

      <div v-else-if="complaints.length === 0" style="text-align: center; padding: 2rem;">
        Belum ada pengaduan yang diajukan.
      </div>

      <table v-else>
        <thead>
          <tr>
            <th>ID</th>
            <th>Ruangan</th>
            <th>Kategori</th>
            <th>Judul & Bukti</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in complaints" :key="c.id">
            <td>#{{ c.id }}</td>
            <td>{{ c.room?.name }}</td>
            <td>{{ c.category?.name }}</td>
            <td>
              <strong>{{ c.title }}</strong><br />
              <small>{{ c.description }}</small><br />
              <a v-if="c.evidence_image" :href="'http://127.0.0.1:8001/storage/' + c.evidence_image" target="_blank" style="font-size: 12px;">Lihat Bukti</a>
              <small v-else style="color: #888;">Tidak ada foto</small>
            </td>
            <td>
              <span :class="['badge', c.status === 'accepted' ? 'badge-success' : c.status === 'rejected' ? 'badge-danger' : 'badge-warning']">
                {{ c.status }}
              </span>
              <div v-if="c.status === 'rejected'" style="margin-top: 5px;">
                <small style="color: #c00;">Alasan: {{ c.rejection_reason }}</small>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
