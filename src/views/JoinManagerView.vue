<template>
    <v-app>
        <div class="centered-container">
            <!-- 화면 생성 뷰 -->
            <div class="mx-auto centered-container">
                <v-card class="mx-auto pa-12 pb-8" elevation="8" width="700" height="600" rounded="lg">
                    <div class="mx-auto centered-container"
                        style="text-align: center; padding-bottom: 20px; font-weight: bold; font-size: 35px;">
                        관리자 회원가입</div>
                    <v-text-field v-model="manager.placeNm" label="영업장 이름" style="margin-top: 10px;"
                        variant="outlined"></v-text-field>
                    <v-text-field v-model="manager.placeAdd" label="영업장주소" variant="outlined"></v-text-field>
                    <v-text-field v-model="manager.placeNo" placeholder="'-'없이 숫자만 입력" label="사업자등록번호"
                        variant="outlined"></v-text-field>
                    <v-text-field v-model="manager.placePhone" placeholder="010-1234-5678" label="영업장 전화번호"
                        variant="outlined"></v-text-field>
                    <v-layout>
                        <v-autocomplete v-model="manager.placeOpen" label="영업 시작 시간" :items="timeSlots"
                            style="margin-right:15px;" variant="underlined"></v-autocomplete>
                        <v-autocomplete v-model="manager.placeClose" label="영업 종료 시간" :items="timeSlots"
                            style="margin-left:15px;" variant="underlined"></v-autocomplete>
                    </v-layout>

                    <div class="button">
                        <v-btn class="mr-2" @click="JoinManager()">회원가입</v-btn>
                    </div>

                </v-card>
            </div>
        </div>
    </v-app>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
    data() {
        return {
            targetUser: '',
            manager: {
                id: this.$route.query.user_id,
                placeNm: '',
                placeAdd: '',
                placeNo: 0,
                placePhone: '',
                placeOpen: '',
                placeClose: '',
            },
            timeSlots: []
        }
    },
    mounted() {
        this.targetUser = this.$route.query.user_id;
        this.generateTimeSlots();
    },
    methods: {
        generateTimeSlots() {
            const startTime = 1; // 시작 시간 (24시간 형식)
            const endTime = 24; // 종료 시간 (24시간 형식)
            const interval = 30; // 시간 간격 (분 단위)

            for (let hour = startTime; hour <= endTime; hour++) {
                for (let minute = 0; minute < 60; minute += interval) {
                    const timeSlot = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                    this.timeSlots.push(timeSlot);
                }
            }
        },
        JoinManager() {
            this.$axios.post('/api/user/manager', this.manager)
                .then(result => {
                    if (result.data.result == 'ok') {
                        alert("회원가입이 완료되었습니다.")
                        this.$router.push("/login")
                    }
                    else {
                        alert(result.data.message)
                    }
                })
        }
    }
})

</script>

<style></style>