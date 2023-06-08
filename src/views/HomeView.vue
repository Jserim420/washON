<template>
  <!-- 상단 맵/사용자페이지 화면-->
  <div class="mx-auto search" style="width: 700px;">
    <v-card-text>
      <v-text-field v-model="startKeyword" :loading="loading" density="compact" variant="solo" label="세차장 검색"
        append-inner-icon="mdi-magnify" single-line hide-details
        @click:append-inner="getPlace(startKeyword)"></v-text-field>
    </v-card-text>
  </div>
  <div class="centered-container" style="margin-bottom: 10px; color: grey;">중심 위치를 기준으로 주변 세차장 정보가 표시됩니다.

  </div>
  <div class="centered-container" style="margin-bottom: 10px; color: red;">아이콘을 클릭하면 세차장 정보를 확인할 수 있습니다.</div>
  <v-btn variant="plain" height="40" style="margin-left:1150px;" @click="getCurrentLocation()">
    현재 위치로 이동 <img src="/current-icon.png" alt="현재위치" height="30" width="30" />
  </v-btn>
  <div class="map">
    <v-card width="700" height="500">
      <div id="map" :width="1000" :height="1000"></div>
    </v-card>

  </div>

  <!-- 세차장 정보-->


  <v-container class="mx-auto centered-container" style="width: 1000px;">
    <div>
      <div class="row">
        <div class="col" v-for="(   place, index   ) in    place   " :key="index">
          <v-card style="margin-bottom:20px" width="250px" height="130px">
            <v-card-title>{{ place.place_name }}</v-card-title>
            <v-card-text> {{ place.address }} </v-card-text>
            <v-card-actions>
              <v-btn variant="plain" color="black"> {{ place.phone }}</v-btn>
              <v-spacer></v-spacer>
              <v-btn variant="text" color="teal-accent-4" @click="reserve(place)"> 예약하기</v-btn>
            </v-card-actions>
          </v-card>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HomeView',
  data() {
    return {
      startKeyword: "",
      currentLng: null,
      currentLat: null,
      user: {
        id: '',
        password: ''
      },
      keyword: '세차',
      reserveList: [],
      place: [],
      map: null,
      markers: [],
      overlays: []
    }
  },
  mounted() {
    this.$axios.post("/api/user/info")
      .then(result => {
        if (result.data.result == "ok") {
          this.$store.commit("setLoginUser", result.data.user)
        }
      });

    this.getCurrentLocation()

  },
  methods: {
    getCurrentLocation() {
      if (navigator.geolocation) {
        // 현재 위치를 가져옴
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.currentLat = position.coords.latitude;
            this.currentLng = position.coords.longitude;

            console.log(this.currentLat, this.currentLng)

            this.drawMap()
          },
          error => {
            console.error('사용자의 위치 서비스를 불러오는데 오류가 생겼습니다: ', error);
          }
        );
      } else {
        console.error('위치 서비스를 허용 해 주세요.');
      }
    },
    drawMap() {
      window.kakao.maps.load(() => {
        var container = document.getElementById('map');

        var options = {
          center: new kakao.maps.LatLng(this.currentLat, this.currentLng),
          level: 5,
          mapTypeId: kakao.maps.MapTypeId.ROADMAP // 지도종류
        };

        this.map = new kakao.maps.Map(container, options);

        kakao.maps.event.addListener(this.map, 'dragend', () => {
          var center = this.map.getCenter();
          this.currentLng = center.getLng();
          this.currentLat = center.getLat();
          console.log(this.currentLng, this.currentLat)
          this.getPlace(this.keyword);
        })

        this.getPlace(this.keyword);


      })
    },
    getPlace(keyword) {

      if (!keyword) alert("검색어를 입력해주세요.")
      else {
        this.removeMarker();

        const REST_API_KEY = 'bbb0d8c968fab0d6b6a29f060b3ffa76'; // 카카오 REST API 키

        console.log(keyword, this.currentLat, this.currentLng)
        // Kakao API 요청을 위한 URL 설정
        const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${keyword}&x=${this.currentLng}&y=${this.currentLat}&radius=20000`;

        // 요청 설정
        const options = {
          method: 'GET',
          headers: {
            Authorization: `KakaoAK ${REST_API_KEY}`,
          },
        };

        // 카카오 API 호출
        fetch(url, options)
          .then(response => response.json())
          .then(data => {
            // 검색 결과에서 장소 정보 추출
            console.log(data.documents)
            const places = data.documents.map(place => ({
              place_name: place.place_name,
              phone: place.phone,
              address: place.address_name,
              roadAddress: place.road_address_name,
              Lng: place.x, // 경도
              Lat: place.y, // 위도
            }));

            // 추출한 장소 정보 출력 또는 원하는 처리 수행
            console.log(places);
            this.place = places.slice(0, 9);

            var imageSrc = '/marker-icon.png', // 마커이미지의 주소입니다    
              imageSize = new kakao.maps.Size(30, 30), // 마커이미지의 크기입니다
              imageOption = { offset: new kakao.maps.Point(27, 69) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

            // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
            var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption)

            places.forEach(place => {
              const markerPosition = new kakao.maps.LatLng(place.Lat, place.Lng);
              var marker = new kakao.maps.Marker({
                position: markerPosition,
                map: this.map,
                image: markerImage
              });

              var content = '<div class="wrap">' +
                '    <div class="info">' +
                '        <div class="info-title">' + place.place_name +
                '            <div class="close" title="닫기"></div>' +
                '        </div>' +
                '        <div class="body">' +
                '            <div class="desc">' +
                '                <div class="ellipsis">' + place.address + '</div>' +
                '                <div class="jibun ellipsis">' + place.roadAddress + '</div>' +
                '                <div class="link">' + place.phone + '</div>' +
                '        </div>' +
                '    </div>' +
                '</div>';





              var overlay = null;
              // 마커를 클릭했을 때 커스텀 오버레이를 표시합니다
              kakao.maps.event.addListener(marker, 'click', () => {
                console.log("화면 클릭")

                overlay = new kakao.maps.CustomOverlay({
                  content: content,
                  clickable: false,
                  map: this.map,
                  position: marker.getPosition(),
                });

                var closeBtn = document.querySelector('.close');
                closeBtn.addEventListener('click', () => {
                  console.log("삭제 클릭")
                  overlay.setMap(null);
                });

                this.overlays.push(overlay);
              });


              this.markers.push(marker);

            });

          })
          .catch(error => {
            console.error('카카오 API 요청 실패:', error);
          });
      }
    },
    removeMarker() {
      this.map.setCenter(new kakao.maps.LatLng(this.currentLat, this.currentLng));

      console.log("removeMarker()");
      console.log(this.markers);
      console.log(this.overlays);
      if (this.markers.length > 0) {
        this.markers.forEach(marker => {
          marker.setMap(null);
        });
      }
      if (this.overlays.length > 0) {
        this.overlays.forEach(overlay => {
          overlay.setMap(null);
        });
      }
    },
    reserve(place) {
      if (this.$store.state.loginUser) {
        this.$router.push({
          path: '/reserve',
          query: {
            place_name: place.place_name,
            place_address: place.address
          }
        });
      }
      else {
        alert("로그인을 하신 후 예약이 가능합니다.")
        this.$router.push('/login')
      }
    }
  }
})
</script>

<style>
#map {
  width: 700px;
  height: 500px;
}

.map,
.centered-container {
  display: flex;
  justify-content: center;
  align-items: center;

}

.wrap {
  position: absolute;
  left: 0;
  bottom: 40px;
  width: 288px;
  height: 132px;
  margin-left: -144px;
  margin-bottom: 15px;
  text-align: left;
  overflow: hidden;
  font-size: 12px;
  font-family: 'Malgun Gothic', dotum, '돋움', sans-serif;
  line-height: 1.5;
}

.wrap * {
  padding: 0;
  margin: 0;
}

.wrap .info {
  width: 286px;
  height: 120px;
  border-radius: 5px;
  border-bottom: 2px solid #ccc;
  border-right: 1px solid #ccc;
  overflow: hidden;
  background: #fff;
}

.wrap .info:nth-child(1) {
  border: 0;
  box-shadow: 0px 1px 2px #888;
}

.info .info-title {
  padding: 5px 0 0 10px;
  height: 30px;
  background: #eee;
  border-bottom: 1px solid #ddd;
  font-size: 18px;
  font-weight: bold;
  color: black;
}

.info .close {
  position: absolute;
  top: 10px;
  right: 10px;
  color: #888;
  width: 17px;
  height: 17px;
  background: url('https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/overlay_close.png');
}

.info .close:hover {
  cursor: pointer;
}

.info .body {
  position: relative;
  overflow: hidden;
}

.info .desc {
  position: relative;
  margin: 13px 0 0 50px;
  height: 75px;
}

.desc .ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.desc .jibun {
  font-size: 11px;
  color: #888;
  margin-top: -2px;
}

.info .img {
  position: absolute;
  top: 6px;
  left: 5px;
  width: 73px;
  height: 71px;
  border: 1px solid #ddd;
  color: #888;
  overflow: hidden;
}

.info:after {
  content: '';
  position: absolute;
  margin-left: -12px;
  left: 50%;
  bottom: 0;
  width: 22px;
  height: 12px;
  background: url('https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/vertex_white.png')
}

.info .link {
  color: #5085BB;
}

.info-title {
  display: block;
  background: #50627F;
  color: #fff;
  text-align: center;
  height: 24px;
  line-height: 22px;
  border-radius: 4px;
  padding: 0px 10px;
}

.check,
.reservelist {
  margin-top: 20px;
  margin-bottom: 20px;
}

.join {
  font-size: 15px;
  color: red;
}

.join:hover,
img:hover,
p {
  cursor: pointer;
}

table {
  margin-left: 150px;
  margin-top: 20px;
  border-collapse: collapse;
}

table tr th {
  border-bottom: 1px solid #999;
  font-size: 20px;
  padding-bottom: 5px;
}

table tr td {
  border-bottom: 1px solid #999;
  padding: 10px 0;
}

table tbody tr:hover {
  cursor: pointer;
  background-color: #eee;
}

.title {
  margin: 20px 0px;
  color: black;
  font-size: 30px;
  font-weight: bold;
}

.row {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.col {
  padding: 0 10px;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}
</style>