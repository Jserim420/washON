<template>
    <v-app>
        <div class="mx-auto">
            <div class="title">회원 정보</div>
            <div class="mx-auto centered-container user-info">
                <v-text-field v-model="this.$store.state.loginUser.name" label="이름" variant="outlined"
                    disabled></v-text-field>
            </div>
            <div class="mx-auto centered-container user-info">
                <v-text-field v-model="this.$store.state.loginUser.id" label="아이디" variant="outlined"
                    disabled></v-text-field>
            </div>
            <div class="mx-auto centered-container user-info">
                <v-text-field v-model="phoneNo" label="전화번호" variant="outlined" :disabled="disabled"></v-text-field>
                <v-btn v-if="disabled" variant="plain" style="margin-bottom: 20px; color:red;"
                    @click="confirmChangePhoneNo()">변경
                </v-btn>
                <v-btn v-if="!disabled" variant="plain" style="margin-bottom: 20px; color:red;"
                    @click="confirmChangePhoneNo()">취소</v-btn>
                <v-btn v-if="!disabled" variant="plain" style="margin-bottom: 20px; color:red;"
                    @click="changePhoneNo()">완료</v-btn>
            </div>
            <div class="mx-auto centered-container user-info" v-if="booleanPW == true">
                <v-text-field v-model="password" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[rules.required, rules.min]" :type="show1 ? 'text' : 'password'" name="input-10-1"
                    label="변경 비밀번호" hint="4글자 이상입력하세요." counter @click:append="show1 = !show1"
                    variant="outlined"></v-text-field>
                <v-btn variant="plain" style="margin-bottom: 20px; color:red;" @click="changePW()">완료</v-btn>
            </div>
            <v-btn v-else class="mx-auto centered-container" :width="300" variant="outlined"
                @click="booleanPW = !booleanPW">비밀번호 변경</v-btn>


            <div class="title">예약 정보</div>
            <div class="mx-auto centered-container reserve-list" v-for="(reserveList, index) in  reserveList " :key="index">
                <v-card class="mx-auto" width="400">
                    <v-card-title>
                        {{ reserveList.placeName }}
                    </v-card-title>
                    <v-card-subtitle>
                        {{ new Date(reserveList.date).toLocaleDateString('ko-KR') }} {{ reserveList.time }}
                    </v-card-subtitle>

                    <v-card-actions>
                        <v-card-text style="font-weight: bold; color:red;">{{ reserveList.reserveState }}</v-card-text>
                        <v-spacer></v-spacer>
                        <v-btn :icon="reserveList.open ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                            @click="toggleCard(reserveList)"></v-btn>
                    </v-card-actions>

                    <v-expand-transition>
                        <div v-show="reserveList.open">
                            <v-divider></v-divider>
                            <v-card-text>
                                예약자 이름 : {{ reserveList.reserveName }}
                            </v-card-text>
                            <v-card-text>
                                예약자 전화번호 : {{ reserveList.reservePhone }}
                            </v-card-text>
                            <v-card-text>
                                예약 차종 : {{ reserveList.carName }}
                            </v-card-text>
                            <v-card-actions v-if="reserveList.reserveState == '예약확정'">
                                <v-spacer></v-spacer>
                                <v-btn color="blue" variant="text"
                                    @click="confirmReserve(reserveList.id, '방문완료')">방문완료</v-btn>
                                <v-btn color="red" variant="text"
                                    @click="confirmReserve(reserveList.id, '예약취소')">예약취소</v-btn>
                            </v-card-actions>
                            <v-card-actions v-else>
                                <v-spacer></v-spacer>
                                <v-btn color="red" variant="text"
                                    @click="confirmReserve(reserveList.id, '예약취소')">예약취소</v-btn>
                            </v-card-actions>
                        </div>
                    </v-expand-transition>
                </v-card>
            </div>
        </div>
    </v-app>
</template>
  
<script>
import { defineComponent } from 'vue';
export default defineComponent({
    name: 'myPage',
    data() {
        return {
            show1: false,
            rules: {
                required: value => !!value || 'Required.',
                min: v => v.length >= 4 || 'Min 4 characters',
                emailMatch: () => '일치하지 않습니다.',
            },
            changedPW: '',
            booleanPW: false,
            reserveList: [],
            disabled: true,
            phoneNo: this.$store.state.loginUser.phoneNo
        }
    },
    mounted() {
        this.getReserveList();
    },
    methods: {
        toggleCard(reserveList) {
            reserveList.open = !reserveList.open;
        },
        confirmReserve(reserveID, state) {
            console.log(reserveID)
            if (state == "예약취소") {
                if (confirm("예약을 취소하시겠습니까?")) {
                    this.setReserveState(reserveID, state)
                }
            } else this.setReserveState(reserveID, state);
        },
        setReserveState(reserveID, state) {
            this.$axios.post("/api/reserve/setState", {
                id: reserveID,
                reserveState: state
            }).then(result => {
                console.log(result.data);
                this.getReserveList();
            })
        },
        getReserveList() {
            this.$axios.post("/api/reserve/list", {
                userId: this.$store.state.loginUser.id
            }).then(result => {
                console.log(result.data);
                this.reserveList = result.data.reserveList.map(reserve => ({
                    ...reserve,
                    open: false
                }));
            })
        },
        confirmChangePhoneNo() { // 전화번호 변경 로직
            this.disabled = !this.disabled
            if (!this.disabled) {
                alert("변경할 전화번호를 입력해주세요.")
            }
        },
        changePhoneNo() {
            this.$axios.post("/api/user/change/phoneNo", {
                userId: this.$store.state.loginUser.id,
                phoneNo: this.phoneNo
            })
                .then(result => {
                    console.log(result.data);
                    alert("전화번호가 변경되었습니다.")
                    this.disabled = !this.disabled
                })
        },
        changePW() {
            this.$axios.post("/api/user/change/password", {
                password: this.password,
                userId: this.$store.state.loginUser.id
            })
                .then(result => {
                    console.log(result.data);
                    alert("비밀번호가 변경되었습니다.")
                    this.booleanPW = !this.booleanPW
                })
        }
    }
})
</script>
  
<style>
.reserve-list {
    margin: 20px;
}

.user-info {
    width: 400px;
}
</style>
  