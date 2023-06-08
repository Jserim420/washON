<template>
    <v-app>
        <div class="centered-container">
            <v-card class="mx-auto pa-12" elevation="8" width="500" height="600" rounded="lg">
                <v-text-field v-model="user.id" label="이메일" persistent-hint variant="outlined"
                    prepend-inner-icon="mdi-email-outline"></v-text-field>
                <v-text-field type="password" v-model="user.password" label="비밀번호" persistent-hint variant="outlined"
                    prepend-inner-icon="mdi-lock-outline"></v-text-field>
                <v-btn block variant="text" :height="50" style="background-color: skyblue; color: black; font-size: 15px;"
                    @click="login()">로그인</v-btn>
                <v-btn block @click="this.$router.push('/join')" variant="tonal" :height="50"
                    style="margin-top: 20px; font-size: 15px;">회원가입</v-btn>
                <div class="social">
                    <div style="font-weight: bold; font-size: 20px; text-align: center;">
                        소셜 로그인
                    </div>
                    <div class="check">
                        <v-layout>
                            <v-card width="70" height="70">
                                <img src="/google.png" alt="구글" height="70" width="70" />
                            </v-card>
                            <v-spacer></v-spacer>
                            <v-card width="70" height="70">
                                <img src="/naver.png" alt="네이버" height="70" width="70" />
                            </v-card>
                            <v-spacer></v-spacer>
                            <v-card width="70" height="70">
                                <img src="/kakao.png" alt="카카오" height="70" width="70" />
                            </v-card>
                        </v-layout>
                    </div>
                </div>
            </v-card>

        </div>
    </v-app>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
    data() {
        return {
            user: {
                id: '',
                password: ''
            }
        }
    },
    methods: {
        login() {
            this.$axios.post("/api/user/login", this.user)
                .then(result => {
                    if (result.data.result == 'ok') {
                        console.log(result.data);
                        this.$store.commit("setLoginUser", result.data.user);
                        alert("어서오세요. WashON 입니다 :)");
                        this.$router.push("/");
                    }
                    else {
                        alert(result.data.message)
                    }
                })
        }
    }
})
</script>

<style>
.social {
    margin: 40px;
}
</style>