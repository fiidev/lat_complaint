<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { client } from '../lib/client';

const router = useRouter();
const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const login = async () => {
  loading.value = true;
  error.value = '';

  try {
    const res = await client.post('/auth/login', {
      email: email.value,
      password: password.value,
    });

    const { token, user } = res.data.data;
    localStorage.setItem('token', token);
    localStorage.setItem('role', user.role);
    localStorage.setItem('user', JSON.stringify(user));

    if (user.role === 'admin') {
      router.push('/admin-complaints');
    } else if (user.role === 'staff') {
      router.push('/staff-tickets');
    } else {
      router.push('/my-complaints');
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Login failed';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div>
    <div class="top-bar">
      <span class="brand">School Complaint System</span>
    </div>
    <div class="l-wrap" style="max-width: 480px; margin-top: 50px;">
      <div class="l-main-article">
        <h2>Sign In</h2>
        <form @submit.prevent="login">
          <div class="group">
            <span>Email Address</span>
            <input type="email" v-model="email" placeholder="admin@admin.com / student@student.com" required />
          </div>

          <div class="group">
            <span>Password</span>
            <input type="password" v-model="password" placeholder="Password akun..." required />
          </div>

          <span v-if="error" class="invalid-feedback">
            <strong>{{ error }}</strong>
          </span>

          <div style="margin-top: 25px;">
            <button type="submit" style="width: 100%;" :disabled="loading">
              {{ loading ? 'Processing...' : 'Login' }}
            </button>
            <div style="text-align: center; margin-top: 15px;">
              <router-link to="/register" style="font-size: 14px;">
                Belum punya akun? Register di sini
              </router-link>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
