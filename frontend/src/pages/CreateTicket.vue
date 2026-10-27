<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { client } from '../lib/client';

const route = useRoute();
const router = useRouter();

const complaintId = route.query.complaint_id;
const complaint = ref(null);
const staffList = ref([]);
const loading = ref(false);

const form = ref({
  assigned_to: '',
  priority: 'medium',
  note: ''
});

onMounted(async () => {
  if (!complaintId) {
    alert('ID Pengaduan tidak ditemukan');
    return router.push('/admin-complaints');
  }

  try {
    const [resComplaint, resStaff] = await Promise.all([
      client.get(`/complaints/${complaintId}`),
      client.get('/admin/users?role=staff')
    ]);

    complaint.value = resComplaint.data.data;
    staffList.value = resStaff.data.data;
  } catch (err) {
    alert(err.response?.data?.message || 'Gagal memuat data');
  }
});

const save = async () => {
  loading.value = true;
  try {
    await client.post(`/admin/complaints/${complaintId}/tickets`, {
      assigned_to: form.value.assigned_to,
      priority: form.value.priority,
      note: form.value.note
    });

    alert('Tiket berhasil dibuat dan ditugaskan ke staf!');
    router.push('/admin-complaints');
  } catch (err) {
    alert(err.response?.data?.message || 'Gagal membuat tiket');
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="l-wrap" style="max-width: 600px;">
    <div class="l-main-article">
      <h2>Assign Ticket to Staff</h2>

      <p v-if="complaint" style="color: #666; font-size: 14px; margin-bottom: 20px;">
        Pengaduan #{{ complaint.id }}: <strong>{{ complaint.title }}</strong> ({{ complaint.room?.name }})
      </p>

      <form @submit.prevent="save">
        <div class="group">
          <span>Pilih Teknisi Lapangan</span>
          <select v-model="form.assigned_to" required>
            <option value="">-- Pilih Staf Teknisi --</option>
            <option v-for="s in staffList" :key="s.id" :value="s.id">
              {{ s.name }} ({{ s.email }})
            </option>
          </select>
        </div>

        <div class="group">
          <span>Prioritas Penanganan</span>
          <select v-model="form.priority" required>
            <option value="low">Low Priority (Biasa)</option>
            <option value="medium">Medium Priority (Sedang)</option>
            <option value="high">High / Urgent (Darurat)</option>
          </select>
        </div>

        <div class="group">
          <span>Catatan / Instruksi Kerja</span>
          <textarea v-model="form.note" rows="3" placeholder="Instruksi pengerjaan untuk teknisi lapangan..."></textarea>
        </div>

        <div>
          <button type="submit" :disabled="loading">
            {{ loading ? 'Processing...' : 'Create Ticket' }}
          </button>
          <router-link to="/admin-complaints" class="button" style="background: #777;">Cancel</router-link>
        </div>
      </form>
    </div>
  </div>
</template>
