<template>
  <v-container class="main-container with-side-lines">
    <!-- 페이지 제목 섹션 -->
    <div class="title-container">
      <h1>음식 분석 결과</h1>
    </div>

    <v-row justify="center">
      <v-col cols="100" sm="80" md="70">
        <div class="file-input-container">
          <v-file-input
            v-model="file"
            @change="changeFile"
            label="사진 선택"
            outlined
            dense
            class="file-input larger-file-input"
            prepend-icon="mdi-paperclip"
          ></v-file-input>
          <v-btn @click="changeFile" class="send-button larger-button" block>사진 전송</v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- 추천 운동 이미지 섹션 -->
    <div v-if="exercise_image" class="exercise-image-container">
      <img :src="exercise_image" alt="추천 운동 이미지" class="exercise-image" />
    </div>

    <!-- 음식 정보와 버튼을 감싸는 새로운 컨테이너 -->
    <div class="info-button-container">
      <!-- 음식 정보 섹션 -->
      <div class="info-section">
        <h2>음식 정보</h2>
        <p><strong>음식 이름:</strong> {{ food_name }}</p>
        <p><strong>칼로리:</strong> {{ calories }} kcal</p>
        <p><strong>영양분:</strong> {{ nutrient }}</p>
        <p><strong>추천 운동:</strong> {{ exercise }}</p>
      </div>

      <!-- 다른 페이지로 이동하는 버튼 -->
      <v-row justify="center" class="navigate-button-container">
        <v-col cols="100" sm="80" md="70">
          <v-btn @click="goToAnotherPage" class="navigate-button" block>운동&영양제 페이지로 이동</v-btn>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>


<script>

export default {
    data(){
        return{
            file: null,
            food_name:null,
            calories:null,
            nutrient:null,
            exercise_image: null // 운동 이미지 URL을 저장할 속성 추가
            
        }
    },
    methods: {
        async changeFile() {
            console.log("test")
            console.log(this.file)

            var response =await this.$axios.post("/api/comidafoto", {
                file:this.file
            },{
               headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            console.log(response.data)
            this.food_name = response.data.food_name
            this.calories = response.data.calories
            this.nutrient = response.data.nutrient
            this.exercise = response.data.exercise
            this.exercise_image = response.data.exercise_image; // 운동 이미지 URL 설정
          }, catch (error) {
            console.error("Error fetching data:", error);
            
        },
    // 새로운 페이지로 이동하는 메소드
    goToAnotherPage() {
      this.$router.push('/efoto'); // 다른 페이지 경로로 이동
      }
    }
}
</script>

<style scoped>
body {
  background-color: #f5f5f5; /* 배경색 설정 */
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  margin: 0;
}

.main-container {
  position: relative;
  min-height: 90vh;
  width: 80vw;
  max-width: 600px;
  background-color: #ffffff; /* 메인 컨테이너 배경색을 흰색으로 설정 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 20px;
  box-sizing: border-box;
  border-left: 5px solid #000000; /* 왼쪽 검은색 선 추가 */
  border-right: 5px solid #000000; /* 오른쪽 검은색 선 추가 */
}

/* 양쪽에 굵은 검은색 선 추가와 배경색 변경 */
.with-side-lines::before,
.with-side-lines::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px; /* 배경색을 적용할 너비 */
  background-color: #ffffff49; /* 선 옆 배경색 변경 (연한 회색) */
}

.with-side-lines::before {
  left: -20px; /* 왼쪽 배경색 위치 */
}

.with-side-lines::after {
  right: -20px; /* 오른쪽 배경색 위치 */
}

/* 페이지 제목 스타일 */
.title-container {
  text-align: center;
  margin-bottom: 30px; /* 제목과 다음 섹션 간의 간격 */
}
.title-container h1 {
  font-size: 2em; /* 제목 크기 설정 */
  font-weight: bold; /* 제목을 두껍게 설정 */
  color: #333; /* 텍스트 색상 설정 */
  margin: 0; /* 기본 여백 제거 */
}

.file-input-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px; /* 입력창과 버튼 사이의 간격 */
  width: 100%;
  padding: 0 20px;
}

.larger-file-input {  /* 파일 입력창 */
  width: 200%;
  max-width: 500px; /* 파일 입력창을 더 넓게 설정하여 강조 */
  font-size: 1.6em; /* 폰트 크기를 키워 강조 */
  padding: 20px; /* 입력창의 높이를 크게 설정 */
  height: 70px; /* 높이를 설정해 더 눈에 띄도록 */
}

.larger-file-input .v-input__prepend-inner > .v-icon {
  font-size: 1em; /* 파일 업로드 아이콘을 더 크게 설정 */
}

.larger-button {
  width: 100%;
  max-width: 200px; /* 버튼을 더 넓게 설정 */
  padding: 25px; /* 버튼의 높이를 키워 사용자가 쉽게 클릭하도록 설정 */
  font-size: 1.5em; /* 버튼의 폰트 크기를 크게 하여 강조 */
  background-color: #42b983; /* Vue 테마 색상으로 강조 */
  color: #ffffff;
  border-radius: 10px; /* 모서리를 부드럽게 설정 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 버튼에 그림자 추가 */
}

.larger-button:hover {
  background-color: #369a6b; /* 호버 시 색상 변화 추가 */
}

/* 다른 페이지로 이동하는 버튼 스타일 */
.navigate-button-container {
  margin-top: 200px; /* 버튼을 더 아래로 내리기 위한 여백 */
}


/* 다른 페이지로 이동하는 버튼 스타일 */
.navigate-button {
  width: 100%;
  max-width: 250px; /* 버튼의 최대 너비 설정 */
  margin-top: 20px; /* 음식 정보 섹션과의 간격 설정 */
  padding: 20px; /* 버튼 높이를 설정 */
  font-size: 1.0em; /* 버튼의 폰트 크기를 설정 */
  background-color: #ffaa00; /* 다른 색상으로 강조 */
  color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 버튼에 그림자 추가 */
  text-transform: uppercase; /* 버튼 텍스트를 대문자로 표시 */
}
.navigate-button:hover {
  background-color: #e69900; /* 호버 시 색상 변화 */
}

.exercise-image-container {
  margin-top: 30px; /* 버튼과 이미지 사이의 간격 */
  display: flex;
  justify-content: center; /* 이미지를 중앙에 배치 */
  align-items: center;
  width: 100%;
}

.exercise-image {
  width: 100%;
  max-width: 300px; /* 이미지의 최대 너비 설정 */
  height: auto;
  border-radius: 10px; /* 이미지의 모서리를 부드럽게 설정 */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* 이미지에 그림자 추가 */
}

.info-button-container {
  margin-top: auto; /* 음식 정보 컨테이너를 가능한 한 아래로 배치 */
  width: 100%;
  padding: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.info-section {
  width: 100%;
  max-width: 400px;
  margin-bottom: 1px; /* 음식 정보 섹션과 버튼 사이의 여백 */
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: left;
  font-size: 1em;
}

.info-section h2 {
  font-size: 1.5em; /* 제목 크기 강조 */
  margin-bottom: 15px;
}

@media (max-width: 600px) {
  .main-container {
    width: 100%; /* 작은 화면에서는 전체 너비 사용 */
  }

  .file-input-container {
    gap: 20px;
  }

  .larger-file-input,
  .larger-button {
    max-width: 100%; /* 작은 화면에서는 전체 너비 사용 */
    font-size: 1.3em; /* 폰트 크기를 크게 유지 */
    padding: 15px; /* 충분한 터치 영역 유지 */
  }

  .info-section {
    padding: 15px;
    font-size: 0.9em;
  }
}
</style>
