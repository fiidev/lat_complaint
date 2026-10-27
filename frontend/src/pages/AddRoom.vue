<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { client } from '../lib/client';

const router = useRouter();
const form = ref({
  building: '',
  room_number: '',
  name: '',
  is_active: 1
});

const save = async () => {
  try {
    await client.post('/rooms', form.value);
    alert('Ruangan berhasil ditambahkan!');
    router.push('/rooms');
  } catch (err) {
    alert(err.response?.data?.message || 'Gagal menambahkan ruangan');
  }
};
</script>

<template>
  <div class="l-wrap" style="max-width: 600px;">
    <div class="l-main-article">
      <h2>Add New Room</h2>
      <form @submit.prevent="save">
        <div class="group">
          <span>Gedung / Building</span>
          <input type="text" v-model="form.building" placeholder="Contoh: Gedung A" required />
        </div>

        <div class="group">
          <span>Nomor Ruang</span>
          <input type="text" v-model="form.room_number" placeholder="Contoh: A-101" required />
        </div>

        <div class="group">
          <span>Nama Ruangan</span>
          <input type="text" v-model="form.name" placeholder="Contoh: Lab Komputer 1" required />
        </div>

        <div class="group">
          <span>Status Ruangan</span>
          <select v-model="form.is_active" required>
            <option :value="1">Active / Aktif</option>
            <option :value="0">Inactive / Nonaktif</option>
          </select>
        </div>

        <div>
          <button type="submit">Save Room</button>
          <router-link to="/rooms" class="button" style="background: #777;">Cancel</router-link>
        </div>
      </form>
    </div>
  </div>
</template>
