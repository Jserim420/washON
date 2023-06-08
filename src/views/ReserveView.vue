<template>
    <v-app v-if="targetPlace == null">
        <h1>예약페이지</h1>
    </v-app>
    <v-app v-else>
        <div class="mx-auto">
            <div class="title">예약하기
            </div>

            <div class="mx-auto centered-container" style="margin-top:20px;">
                <v-card class="mx-auto" width="500" height="430">
                    <div id="staticmap"></div>
                    <div style="margin-top:10px; margin-left:10px">
                        <v-card-title style="font-weight: bold;">{{ this.newPlace }}</v-card-title>
                        <v-card-subtitle>{{ targetPlace.address }}</v-card-subtitle>
                    </div>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn variant="text" color="teal-accent-4">{{ targetPlace.phone }}</v-btn>
                    </v-card-actions>
                </v-card>
            </div>

            <div class="title">예약 정보</div>
            <v-card class="mx-auto pa-12" elevation="8" width="500" height="600" rounded="lg">
                <div class="mx-auto">
                    <datepicker class="datepick" v-model="reserve.date" :format="format" :calendar-props="calendarProps"
                        :clearable="true" :lower-limit="today" :locale="koreanLocale"></datepicker>
                </div>

                <div style="width:400px; margin-top:30px;">
                    <v-text-field v-model="reserve.reserveName" label="방문자 성명" persistent-hint
                        variant="outlined"></v-text-field>
                    <v-text-field v-model="reserve.reservePhone" label="방문자 전화번호" placeholder="010-1234-5678"
                        persistent-hint variant="outlined"></v-text-field>
                    <v-text-field v-model="reserve.carName" label="예약차종" persistent-hint variant="outlined"></v-text-field>
                </div>

                <div>
                    <v-btn class="timebtn" variant="tonal" v-for=" hour  in  hours " :key="hour"
                        :class="{ 'selected': reserve.time === hour }"
                        :style="{ backgroundColor: reserve.time === hour ? 'aqua' : '' }"
                        @click="this.reserve.time = hour">{{
                            hour }}</v-btn>
                </div>
            </v-card>

            <div class="mx-auto centered-container">
                <v-btn border variant="text" prepend-icon="mdi-check"
                    style="margin-top:50px; margin-bottom:100px; font-size: 20px; color:red;" width="300px" height="50px"
                    @click="setReserve()">예약하기</v-btn>
            </div>
        </div>
    </v-app>
</template>
  
<script>
import { defineComponent } from 'vue';
// Require Esperanto locale
import { ko } from 'date-fns/locale'
import Datepicker from 'vue3-datepicker';

import "vue3-datepicker/dist/vue3-datepicker.css";

export default defineComponent({
    components: {
        Datepicker
    },
    data() {
        return {
            today: new Date(),
            newPlace: '',
            newAdd: '',
            reserve: {
                reserveName: this.$store.state.loginUser.name,
                reservePhone: this.$store.state.loginUser.phoneNo,
                carName: '',
                date: new Date(),
                time: '',
                userId: this.$store.state.loginUser.id,
                placeName: this.$route.query.place_name,
                placeAdd: this.$route.query.place_address,
            },
            hours: [],
            targetPlace: null,
            format: 'yyyy-MM-dd',
            koreanLocale: ko

        };
    },
    mounted() {
        this.newPlace = this.$route.query.place_name;
        this.newAdd = this.$route.query.place_address;
        this.generateTimeSlots();


        if (!this.$store.state.loginUser) {
            alert("로그인을 먼저 해야 예약할 수 있습니다.")
            this.$router.push('/login')
        }
        else {
            window.kakao.maps.load(async () => {
                var result = await this.getMark();
                var staticMapContainer = document.getElementById('staticmap');

                var staticMapOption = {
                    marker: {
                        text: this.newPlace,
                        position: new window.kakao.maps.LatLng(this.targetPlace.Lat, this.targetPlace.Lng),
                    },
                    center: new window.kakao.maps.LatLng(this.targetPlace.Lat, this.targetPlace.Lng),
                    level: 3,
                    mapTypeId: window.kakao.maps.MapTypeId.PADMAP,
                };

                var staticMap = new window.kakao.maps.StaticMap(
                    staticMapContainer,
                    staticMapOption
                );
            });

        }
    },
    computed: {
        formattedDate() {
            const month = this.selectedDate.getMonth() + 1; // 월은 0부터 시작하므로 1을 더해줍니다.
            const day = this.selectedDate.getDate();

            return `${month}/${day}`;
        }
    },
    methods: {
        async getMark() {
            return new Promise(resolve => {
                navigator.geolocation.getCurrentPosition((position) => {

                    const REST_API_KEY = 'bbb0d8c968fab0d6b6a29f060b3ffa76'; // 카카오 REST API 키
                    const keyword = this.newAdd; // 검색할 키워드

                    // Kakao API 요청을 위한 URL 설정
                    const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${keyword}`;

                    // 요청 설정
                    const options = {
                        method: 'GET',
                        headers: {
                            Authorization: `KakaoAK ${REST_API_KEY}`,
                        },
                    };

                    // 카카오 API 호출

                    fetch(url, options)
                        .then((response) => response.json())
                        .then((data) => {
                            // 검색 결과에서 장소 정보 추출
                            const places = data.documents.map((place) => ({
                                place_name: place.place_name,
                                phone: place.phone,
                                address: place.address_name,
                                Lng: place.x, // 경도
                                Lat: place.y, // 위도
                            }));

                            // 추출한 장소 정보 출력 또는 원하는 처리 수행
                            console.log(places);
                            console.log(this)
                            // this.places = places;
                            this.targetPlace = places[0]
                            resolve()
                        })
                        .catch((error) => {
                            console.error('카카오 API 요청 실패:', error);
                        });

                });
            })

        }, generateTimeSlots() {
            const startTime = 11; // 시작 시간 (24시간 형식)
            const endTime = 16; // 종료 시간 (24시간 형식)
            const interval = 30; // 시간 간격 (분 단위)

            for (let hour = startTime; hour <= endTime; hour++) {
                const minuteOptions = ["00", "30"]; // 분 옵션 (00 또는 30)

                for (const minute of minuteOptions) {
                    const timeSlot = `${hour}:${minute}`;
                    this.hours.push(timeSlot);
                }
            }
        }, setReserve() {
            if (this.reserve.name == '') {
                alert("예약자명을 입력해주세요.")
                return
            }
            if (this.reserve.phone == '') {
                alert("전화번호를 입력해주세요.")
                return
            }
            if (this.reserve.carname == '') {
                alert("예약할 차종을 입력해주세요.")
                return
            }
            if (this.reserve.time == '') {
                alert("예약 시간을 선택해주세요.")
                return
            }

            console.log(this.reserve)

            this.$axios.post("/api/reserve/done", this.reserve)
                .then(result => {
                    if (result.data.result == "ok") {
                        alert("예약이 완료되었습니다.")
                        this.$router.push("/mypage")
                    }
                    else {
                        alert(result.data.message)
                    }
                });
        }

    },
});
</script>
  
<style>
#staticmap {
    width: 500px;
    height: 300px;
}

.placecard {
    margin-top: 20px;
}

.datepick {
    text-align: center;
    border: 1px solid gray;
    width: 150px;
    height: 35px;
    border-radius: 5px;
}

.timebtn {
    margin: 10px;
}

.reserve-text {
    margin: 12px;
}
</style>
  