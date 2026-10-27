<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { client } from '../lib/client';

const route = useRoute();
const router = useRouter();
const id = route.params.id;

const form = ref({
  building: '',
  room_number: '',
  name: '',
  is_active: 1
});

onMounted(async () => {
  try {
    const res = await client.get(`/rooms/${id}`);
    const r = res.data.data;
    form.value = {
      building: r.building,
      room_number: r.room_number,
      name: r.name,
      is_active: r.is_active ? 1 : 0
    };
  } catch (err) {
    alert(err.response?.data?.message || 'Gagal memuat detail ruangan');
    router.push('/rooms');
  }
});

const save = async () => {
  try {
    await client.put(`/rooms/${id}`, form.value);
    alert('Ruangan berhasil diperbarui!');
    router.push('/rooms');
  } catch (err) {
    alert(err.response?.data?.message || 'Gagal memperbarui ruangan');
  }
};
</script>

<template>
  <div class="l-wrap" style="max-width: 600px;">
    <div class="l-main-article">
      <h2>Update Room #{{ id }}</h2>
      <form @submit.prevent="save">
        <div class="group">
          <span>Gedung / Building</span>
          <input type="text" v-model="form.building" required />
        </div>

        <div class="group">
          <span>Nomor Ruang</span>
          <input type="text" v-model="form.room_number" required />
        </div>

        <div class="group">
          <span>Nama Ruangan</span>
          <input type="text" v-model="form.name" required />
        </div>

        <div class="group">
          <span>Status Ruangan</span>
          <select v-model="form.is_active" required>
            <option :value="1">Active / Aktif</option>
            <option :value="0">Inactive / Nonaktif</option>
          </select>
        </div>

        <div>
          <button type="submit">Update Room</button>
          <router-link to="/rooms" class="button" style="background: #777;">Cancel</router-link>
        </div>
      </form>
    </div>
  </div>
</template>
