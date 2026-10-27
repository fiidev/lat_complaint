<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { client } from '../lib/client';

const router = useRouter();
const name = ref('');
const email = ref('');
const password = ref('');
const password_confirmation = ref('');
const error = ref('');
const loading = ref(false);

const register = async () => {
  if (password.value !== password_confirmation.value) {
    error.value = 'Password confirmation does not match';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    await client.post('/auth/register', {
      name: name.value,
      email: email.value,
      password: password.value,
    });

    alert('Registration successful! Please login.');
    router.push('/login');
  } catch (err) {
    error.value = err.response?.data?.message || 'Registration failed';
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
        <h2>Create Account</h2>
        <form @submit.prevent="register">
          <div class="group">
            <span>Full Name</span>
            <input type="text" v-model="name" placeholder="Nama lengkap..." required />
          </div>

          <div class="group">
            <span>Email Address</span>
            <input type="email" v-model="email" placeholder="Email aktif..." required />
          </div>

          <div class="group">
            <span>Password</span>
            <input type="password" v-model="password" placeholder="Minimal 6 karakter..." required />
          </div>

          <div class="group">
            <span>Confirm Password</span>
            <input type="password" v-model="password_confirmation" placeholder="Ulangi password..." required />
          </div>

          <span v-if="error" class="invalid-feedback">
            <strong>{{ error }}</strong>
          </span>

          <div style="margin-top: 25px;">
            <button type="submit" style="width: 100%;" :disabled="loading">
              {{ loading ? 'Processing...' : 'Register' }}
            </button>
            <div style="text-align: center; margin-top: 15px;">
              <router-link to="/login" style="font-size: 14px;">
                Sudah punya akun? Login di sini
              </router-link>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
