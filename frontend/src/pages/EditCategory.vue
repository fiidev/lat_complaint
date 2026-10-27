<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { client } from '../lib/client';

const route = useRoute();
const router = useRouter();
const id = route.params.id;

const form = ref({
  name: '',
  description: '',
  is_active: 1
});

onMounted(async () => {
  try {
    const res = await client.get(`/complaint-categories/${id}`);
    const c = res.data.data;
    form.value = {
      name: c.name,
      description: c.description || '',
      is_active: c.is_active ? 1 : 0
    };
  } catch (err) {
    alert(err.response?.data?.message || 'Gagal memuat detail kategori');
    router.push('/categories');
  }
});

const save = async () => {
  try {
    await client.put(`/complaint-categories/${id}`, form.value);
    alert('Kategori berhasil diperbarui!');
    router.push('/categories');
  } catch (err) {
    alert(err.response?.data?.message || 'Gagal memperbarui kategori');
  }
};
</script>

<template>
  <div class="l-wrap" style="max-width: 600px;">
    <div class="l-main-article">
      <h2>Update Category #{{ id }}</h2>
      <form @submit.prevent="save">
        <div class="group">
          <span>Nama Kategori</span>
          <input type="text" v-model="form.name" required />
        </div>

        <div class="group">
          <span>Deskripsi Kategori</span>
          <textarea v-model="form.description" rows="3"></textarea>
        </div>

        <div>
          <button type="submit">Update Category</button>
          <router-link to="/categories" class="button" style="background: #777;">Cancel</router-link>
        </div>
      </form>
    </div>
  </div>
</template>
