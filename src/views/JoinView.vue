<template>
  <v-app>
    <div class="centered-container">
      <!-- 화면 생성 뷰 -->
      <div class="mx-auto centered-container">
        <v-card class="mx-auto pa-12 pb-8" elevation="8" width="700" height="700" rounded="lg">
          <div class="mx-auto centered-container"
            style="text-align: center; padding-bottom: 20px; font-weight: bold; font-size: 35px;">
            회원가입</div>
          <v-layout>
            <div class="type">가입종류</div>
            <v-btn variant="tonal" :class="{ 'selected': !isPlainMember }"
              :style="{ backgroundColor: isPlainMember ? 'plum' : '' }" @click="plain()">일반회원</v-btn>
            <v-btn variant="tonal" :class="{ 'selected': !isManager }"
              :style="{ backgroundColor: isManager ? 'plum' : '' }" @click="manager()"
              style="margin-left: 10px;">관리자회원</v-btn>
          </v-layout>

          <v-text-field v-model="user.name" label="이름" style="margin-top: 10px;" variant="outlined"></v-text-field>
          <v-text-field v-model="user.phoneNo" placeholder="010-1234-5678" label="전화번호" variant="outlined"></v-text-field>
          <v-text-field v-model="user.id" label="이메일" prepend-inner-icon="mdi-email-outline"
            variant="outlined"></v-text-field>
          <v-text-field type="password" v-model="user.password" placeholder="4자리 이상" label="비밀번호"
            prepend-inner-icon="mdi-lock-outline" variant="outlined"></v-text-field>
          <v-text-field type="password" v-model="user.passwordConfirm" placeholder="4자리 이상" label="비밀번호 확인"
            prepend-inner-icon="mdi-lock-outline" variant="outlined"></v-text-field>

          <div class="button">
            <div v-if="user.userType == null">가입종류를 선택해주세요.</div>
            <v-btn class="mr-2" @click="Join()" v-if="user.userType == 0">회원가입</v-btn>
            <v-btn class="mr-2" @click="Next(user.id)" v-if="user.userType == 1">다음</v-btn>
          </div>

        </v-card>
      </div>
    </div>
  </v-app>
</template>

<!-- 화면 컨트롤러 -->
<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HomeView',
  data() { // 변수 선언
    return {
      user: {
        userType: null,
        id: '',
        password: '',
        passwordConfirm: '',
        name: '',
        phoneNo: ''
      },
      isPlainMember: false,
      isManager: false
    }
  },
  methods: { // 메소드 생성
    plain() {
      this.isPlainMember = true;
      if (this.isManager) {
        this.isManager = false
      }
      this.user.userType = 0
    },
    manager() {
      this.isManager = true;
      if (this.isPlainMember) {
        this.isPlainMember = false
      }
      this.user.userType = 1
    },
    Join() {
      if (this.user.name == "") {
        alert("이름을 입력해주세요")
        return
      }
      if (this.user.phoneNo == "") {
        alert("전화번호를 입력해주세요")
        return
      }
      if (this.user.id == "") {
        alert("이메일을 입력해주세요")
        return
      }
      if (this.user.password.length < 4) {
        alert("비밀번호는 4자리 이상 이어야 합니다.")
        return
      }
      if (this.user.password != this.user.passwordConfirm) {
        alert("비밀번호가 일치하지 않습니다.")
        return
      }

      this.$axios.post("/api/user/join", this.user)
        .then(result => {
          if (result.data.result == 'ok') {
            alert("회원가입이 완료되었습니다.")
            this.$router.push("/")
          }
          else {
            alert(result.data.message)
          }
        })
    },
    Next() {
      if (this.user.name == "") {
        alert("이름을 입력해주세요")
        return
      }
      if (this.user.phoneNo == "") {
        alert("전화번호를 입력해주세요")
        return
      }
      if (this.user.id == "") {
        alert("이메일을 입력해주세요")
        return
      }
      if (this.user.password.length < 4) {
        alert("비밀번호는 4자리 이상 이어야 합니다.")
        return
      }
      if (this.user.password != this.user.passwordConfirm) {
        alert("비밀번호가 일치하지 않습니다.")
        return
      }

      this.$axios.post("/api/user/join", this.user)
        .then(result => {
          if (result.data.result == 'ok') {
            this.$router.push({
              path: '/join/manager',
              query: {
                user_id: this.user.id
              }
            });
          }
          else {
            alert(result.data.message)
          }
        })

    }
  }
});
</script>

<!-- CSS -->
<style>
.type {
  padding: 5px;
  font-weight: bold;
}

.confirm {
  padding: 17px;
}

.button {
  text-align: right;
}

.join {
  text-align: center;
  padding: 40px;
}
</style>