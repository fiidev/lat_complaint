<script setup>
import { ref, onMounted } from 'vue';
import { client } from '../lib/client';

const complaints = ref([]);
const loading = ref(false);

const load = async () => {
  loading.value = true;
  try {
    const res = await client.get('/admin/complaints');
    complaints.value = res.data.data;
  } catch (err) {
    alert(err.response?.data?.message || 'Gagal memuat review komplain');
  } finally {
    loading.value = false;
  }
};

onMounted(load);

const accept = async (id) => {
  if (!confirm('Terima pengaduan ini?')) return;
  try {
    await client.patch(`/admin/complaints/${id}/accept`);
    load();
  } catch (err) {
    alert(err.response?.data?.message || 'Gagal menerima pengaduan');
  }
};

const reject = async (id) => {
  const reason = prompt('Masukkan alasan penolakan:');
  if (!reason) return;
  try {
    await client.patch(`/admin/complaints/${id}/reject`, { rejection_reason: reason });
    load();
  } catch (err) {
    alert(err.response?.data?.message || 'Gagal menolak pengaduan');
  }
};
</script>

<template>
  <div class="l-wrap">
    <div class="l-sidebar-article"></div>
    <div class="l-main-article">
      <h2>Incoming Complaints Review</h2>

      <div v-if="loading" style="text-align: center; padding: 2rem;">
        Loading data...
      </div>

      <div v-else-if="complaints.length === 0" style="text-align: center; padding: 2rem;">
        Tidak ada pengaduan yang masuk.
      </div>

      <table v-else>
        <thead>
          <tr>
            <th>ID</th>
            <th>Pelapor</th>
            <th>Ruangan</th>
            <th>Kategori</th>
            <th>Judul & Bukti</th>
            <th>Status</th>
            <th>Aksi Peninjauan</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in complaints" :key="c.id">
            <td>#{{ c.id }}</td>
            <td>{{ c.user?.name }}</td>
            <td>{{ c.room?.name }}</td>
            <td>{{ c.category?.name }}</td>
            <td>
              <strong>{{ c.title }}</strong><br />
              <a v-if="c.evidence_image" :href="'http://127.0.0.1:8001/storage/' + c.evidence_image" target="_blank" style="font-size: 12px;">Lihat Bukti</a>
              <small v-else style="color: #888;">Tidak ada foto</small>
            </td>
            <td>
              <span :class="['badge', c.status === 'accepted' ? 'badge-success' : c.status === 'rejected' ? 'badge-danger' : 'badge-warning']">
                {{ c.status }}
              </span>
            </td>
            <td>
              <template v-if="c.status === 'submitted'">
                <button style="background: #28a745; margin-right: 4px;" @click="accept(c.id)">Accept</button>
                <button style="background: #dc3545;" @click="reject(c.id)">Reject</button>
              </template>

              <template v-else-if="c.status === 'accepted'">
                <router-link v-if="!c.ticket" :to="`/create-ticket?complaint_id=${c.id}`" class="button" style="background: #17a2b8; margin: 0;">
                  + Assign Ticket
                </router-link>
                <span v-else class="badge badge-success">
                  Tiket: {{ c.ticket.ticket_number }}
                </span>
              </template>

              <small v-else-if="c.status === 'rejected'" style="color: #c00;">
                Alasan: {{ c.rejection_reason }}
              </small>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
