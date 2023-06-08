<template>
  <v-app>
    <div class="header">
      <div class="main" @click="$router.push('/')"><img src="/logo_small.png" alt="로고이미지" /></div>
      <v-layout>
        <div class="mx-auto" style="width:300px;">
          <div class="mypg" @click="goMyPage()" v-if="$store.state.loginUser">마이페이지</div>
          <div class="mypg" @click="logout()" v-if="$store.state.loginUser">로그아웃</div>
          <div class="loginpg" @click="$router.push('/login')" v-else>로그인</div>
        </div>
      </v-layout>
    </div>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  }),
  mounted() {
  },
  methods: {
    logout() {
      // 로그아웃 상태
      this.$axios.post("/api/user/logout")
        .then(result => {
          this.$store.commit("logout")
          this.$router.push("/")
        })
    },
    reservePage() {
      if (this.$store.state.loginUser) {
        this.$router.push('/reserve')
      }
      else {
        alert("로그인을 하신 후 예약이 가능합니다.")
        this.$router.push('/login')
      }
    },
    goMyPage() {
      if (this.$store.state.loginUser.userType == 0) {
        this.$router.push('/mypage')
      }
      else {
        this.$router.push('/mypage/manager')
      }
    }
  }
}
</script>

<style>
.header {
  text-align: center;
  padding: 50px;
  font-size: 30px;
}

.main:hover {
  cursor: pointer;
}


.reservepg:hover,
.mypg:hover,
.loginpg:hover {
  background-color: blue;
  color: white;
  cursor: pointer;
}

.mx-auto {
  font-size: 20px;
}
</style>
