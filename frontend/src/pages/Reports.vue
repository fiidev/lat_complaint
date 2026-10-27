<script setup>
import { ref, onMounted } from 'vue';
import { client } from '../lib/client';

const startDate = ref('2026-01-01');
const endDate = ref('2026-12-31');

const summary = ref(null);
const categories = ref([]);
const rooms = ref([]);
const loading = ref(false);

const load = async () => {
  loading.value = true;
  try {
    const params = {
      start_date: startDate.value,
      end_date: endDate.value
    };

    const [resSummary, resCats, resRooms] = await Promise.all([
      client.get('/admin/reports/complaints/summary', { params }),
      client.get('/admin/reports/complaints/by-category', { params }),
      client.get('/admin/reports/complaints/by-room', { params }),
    ]);

    summary.value = resSummary.data.data;
    categories.value = resCats.data.data;
    rooms.value = resRooms.data.data;
  } catch (err) {
    alert(err.response?.data?.message || 'Gagal memuat laporan');
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
      <h2>Complaints & Ticket Analytics</h2>

      <!-- Form Filter Rentang Tanggal -->
      <form @submit.prevent="load" style="margin-bottom: 25px; padding: 15px; background: #f9f9f9; border-radius: 4px;">
        <div style="display: flex; gap: 15px; align-items: flex-end; flex-wrap: wrap;">
          <div>
            <label style="display: block; font-size: 13px; font-weight: bold; margin-bottom: 5px;">Start Date</label>
            <input type="date" v-model="startDate" required style="padding: 6px; font-size: 14px;" />
          </div>
          <div>
            <label style="display: block; font-size: 13px; font-weight: bold; margin-bottom: 5px;">End Date</label>
            <input type="date" v-model="endDate" required style="padding: 6px; font-size: 14px;" />
          </div>
          <div>
            <button type="submit" style="padding: 7px 15px; font-size: 14px;">Filter Report</button>
          </div>
        </div>
      </form>

      <div v-if="loading" style="text-align: center; padding: 2rem;">
        Loading data...
      </div>

      <div v-else-if="summary">
        <!-- Summary Cards Table -->
        <table style="margin-bottom: 2rem;">
          <thead>
            <tr>
              <th>Total Complaints</th>
              <th>Submitted</th>
              <th>Accepted</th>
              <th>Rejected</th>
              <th>Tickets (Open)</th>
              <th>Tickets (In Progress)</th>
              <th>Resolved</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong style="font-size: 18px;">{{ summary.total_complaints }}</strong></td>
              <td><span class="badge badge-warning">{{ summary.by_status?.submitted ?? 0 }}</span></td>
              <td><span class="badge badge-success">{{ summary.by_status?.accepted ?? 0 }}</span></td>
              <td><span class="badge badge-danger">{{ summary.by_status?.rejected ?? 0 }}</span></td>
              <td>{{ summary.tickets?.open ?? 0 }}</td>
              <td>{{ summary.tickets?.in_progress ?? 0 }}</td>
              <td><strong style="color: #28a745; font-size: 18px;">{{ summary.tickets?.resolved ?? 0 }}</strong></td>
            </tr>
          </tbody>
        </table>

        <!-- Complaints by Category Breakdown -->
        <h3>Complaints by Category</h3>
        <table style="margin-bottom: 2rem;">
          <thead>
            <tr>
              <th>Nama Kategori</th>
              <th>Deskripsi</th>
              <th>Jumlah Laporan</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in categories" :key="c.id">
              <td><strong>{{ c.name }}</strong></td>
              <td>{{ c.description || '-' }}</td>
              <td>{{ c.complaints_count ?? 0 }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Complaints by Room Breakdown -->
        <h3>Top Problematic Rooms</h3>
        <table>
          <thead>
            <tr>
              <th>Gedung</th>
              <th>No. Ruang</th>
              <th>Nama Ruangan</th>
              <th>Jumlah Pengaduan</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in rooms" :key="r.id">
              <td>{{ r.building }}</td>
              <td>{{ r.room_number }}</td>
              <td><strong>{{ r.name }}</strong></td>
              <td>{{ r.complaints_count ?? 0 }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
