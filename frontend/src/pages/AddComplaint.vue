<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { client } from '../lib/client';

const router = useRouter();
const rooms = ref([]);
const categories = ref([]);
const file = ref(null);
const loading = ref(false);

const form = ref({
  room_id: '',
  category_id: '',
  title: '',
  description: ''
});

onMounted(async () => {
  try {
    const [resRooms, resCats] = await Promise.all([
      client.get('/rooms'),
      client.get('/complaint-categories')
    ]);
    rooms.value = resRooms.data.data;
    categories.value = resCats.data.data;
  } catch (err) {
    alert(err.response?.data?.message || 'Gagal memuat opsi data');
  }
});

const onFile = (e) => {
  file.value = e.target.files[0];
};

const save = async () => {
  loading.value = true;
  const fd = new FormData();
  fd.append('room_id', form.value.room_id);
  fd.append('category_id', form.value.category_id);
  fd.append('title', form.value.title);
  fd.append('description', form.value.description);
  if (file.value) {
    fd.append('evidence_image', file.value);
  }

  try {
    await client.post('/complaints', fd);
    alert('Pengaduan berhasil dikirim!');
    router.push('/my-complaints');
  } catch (err) {
    alert(err.response?.data?.message || 'Gagal mengirim pengaduan');
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="l-wrap" style="max-width: 600px;">
    <div class="l-main-article">
      <h2>Submit New Complaint</h2>
      <form @submit.prevent="save">
        <div class="group">
          <span>Target Room</span>
          <select v-model="form.room_id" required>
            <option value="">-- Select Room --</option>
            <option v-for="r in rooms" :key="r.id" :value="r.id">
              {{ r.name }} ({{ r.building }} - {{ r.room_number }})
            </option>
          </select>
        </div>

        <div class="group">
          <span>Complaint Category</span>
          <select v-model="form.category_id" required>
            <option value="">-- Select Category --</option>
            <option v-for="c in categories" :key="c.id" :value="c.id">
              {{ c.name }}
            </option>
          </select>
        </div>

        <div class="group">
          <span>Complaint Title</span>
          <input type="text" v-model="form.title" placeholder="Contoh: AC Mati dan Panas" required />
        </div>

        <div class="group">
          <span>Detail Description</span>
          <textarea v-model="form.description" rows="4" placeholder="Jelaskan detail masalahnya..." required></textarea>
        </div>

        <div class="group">
          <span>Evidence Image (Photo)</span>
          <input type="file" @change="onFile" accept="image/*" />
        </div>

        <div>
          <button type="submit" :disabled="loading">
            {{ loading ? 'Uploading...' : 'Submit Complaint' }}
          </button>
          <router-link to="/my-complaints" class="button" style="background: #777;">Cancel</router-link>
        </div>
      </form>
    </div>
  </div>
</template>
