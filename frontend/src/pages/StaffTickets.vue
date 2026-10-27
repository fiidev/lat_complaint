<script setup>
import { ref, onMounted } from 'vue';
import { client } from '../lib/client';

const tickets = ref([]);
const loading = ref(false);

const load = async () => {
  loading.value = true;
  try {
    const res = await client.get('/me/tickets');
    tickets.value = res.data.data;
  } catch (err) {
    alert(err.response?.data?.message || 'Gagal memuat tiket tugas');
  } finally {
    loading.value = false;
  }
};

onMounted(load);

const start = async (id) => {
  if (!confirm('Mulai penanganan tiket ini?')) return;
  try {
    await client.patch(`/tickets/${id}/start`);
    load();
  } catch (err) {
    alert(err.response?.data?.message || 'Gagal memulai penanganan');
  }
};

const resolve = async (id) => {
  const note = prompt('Masukkan catatan penyelesaian perbaikan:');
  try {
    await client.patch(`/tickets/${id}/resolve`, { resolution_notes: note });
    load();
  } catch (err) {
    alert(err.response?.data?.message || 'Gagal menyelesaikan tiket');
  }
};
</script>

<template>
  <div class="l-wrap">
    <div class="l-sidebar-article"></div>
    <div class="l-main-article">
      <h2>My Assigned Repair Tickets</h2>

      <div v-if="loading" style="text-align: center; padding: 2rem;">
        Loading data...
      </div>

      <div v-else-if="tickets.length === 0" style="text-align: center; padding: 2rem;">
        Tidak ada tiket tugas yang diberikan untuk Anda saat ini.
      </div>

      <table v-else>
        <thead>
          <tr>
            <th>Nomor Tiket</th>
            <th>Lokasi Ruang</th>
            <th>Detail Masalah</th>
            <th>Prioritas</th>
            <th>Status Pengerjaan</th>
            <th>Aksi Teknisi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in tickets" :key="t.id">
            <td><strong>{{ t.ticket_number }}</strong></td>
            <td>{{ t.complaint?.room?.name }}</td>
            <td>
              <strong>{{ t.complaint?.title }}</strong><br />
              <small>{{ t.complaint?.description }}</small>
            </td>
            <td>
              <span :class="['badge', t.priority === 'high' ? 'badge-danger' : t.priority === 'medium' ? 'badge-warning' : 'badge-info']">
                {{ t.priority }}
              </span>
            </td>
            <td>
              <span :class="['badge', t.status === 'resolved' ? 'badge-success' : t.status === 'in_progress' ? 'badge-warning' : 'badge-info']">
                {{ t.status }}
              </span>
            </td>
            <td>
              <button 
                v-if="t.status === 'open'" 
                style="background: #17a2b8;" 
                @click="start(t.id)">
                Start Work
              </button>
              <button 
                v-else-if="t.status === 'in_progress'" 
                style="background: #28a745;" 
                @click="resolve(t.id)">
                Resolve
              </button>
              <span v-else style="color: green; font-size: 13px;">Completed</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
