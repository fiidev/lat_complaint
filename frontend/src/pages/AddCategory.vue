<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { client } from '../lib/client';

const router = useRouter();
const form = ref({
  name: '',
  description: '',
  is_active: 1
});

const save = async () => {
  try {
    await client.post('/complaint-categories', form.value);
    alert('Kategori berhasil ditambahkan!');
    router.push('/categories');
  } catch (err) {
    alert(err.response?.data?.message || 'Gagal menambahkan kategori');
  }
};
</script>

<template>
  <div class="l-wrap" style="max-width: 600px;">
    <div class="l-main-article">
      <h2>Add New Category</h2>
      <form @submit.prevent="save">
        <div class="group">
          <span>Nama Kategori</span>
          <input type="text" v-model="form.name" placeholder="Contoh: Fasilitas AC" required />
        </div>

        <div class="group">
          <span>Deskripsi Kategori</span>
          <textarea v-model="form.description" rows="3" placeholder="Jelaskan jenis-jenis kerusakan dalam kategori ini..."></textarea>
        </div>

        <div>
          <button type="submit">Save Category</button>
          <router-link to="/categories" class="button" style="background: #777;">Cancel</router-link>
        </div>
      </form>
    </div>
  </div>
</template>
