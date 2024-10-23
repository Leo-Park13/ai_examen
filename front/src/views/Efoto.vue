<template>
    <v-container class="main-container with-side-lines">
    <!-- 페이지 제목 섹션 -->
    <div class="title-container">
      <h1>운동 & 영양제 추천</h1>
    </div>
    <v-row justify="center">
      <v-col cols="100" sm="80" md="70">
        <div class="file-input-container">
          <v-file-input
            v-model="file"
            label="사진 선택"
            outlined
            dense
            class="file-input larger-file-input"
            prepend-icon="mdi-paperclip"
          ></v-file-input>
          <v-btn @click="handleFileUpload" class="send-button larger-button" block>사진 전송</v-btn>
        </div>
      </v-col>
    </v-row>
    <!-- 운동 정보 섹션 -->
    <div class="info-section">
      <h2>운동 정보</h2>
      <p><strong>운동 이름:</strong> {{ exercise_name }}</p>
      <p><strong>추천 영양제: </strong> {{ tonic }}</p>
    </div>
    <!-- 메인 페이지로 이동하는 버튼 추가 -->
    <v-row justify="center" class="navigate-button-container">   
      <v-col cols="100" sm="80" md="70">
        <v-btn @click="goToAnotherPage" class="navigate-button" block>음식 칼로리 계산 페이지로 이동</v-btn>
      </v-col>
    </v-row>
    </v-container>
</template>

<script>
export default {
  data() {
    return {
      file: null, // 파일 데이터
      exercise_name: null, // 운동 이름
      tonic: null, // 추천 영양제 (변수명을 통일하여 소문자 사용)
    };
  },
  methods: {
    async handleFileUpload() {
      // 파일이 선택되었는지 여부 확인
      if (!this.file) {
        console.error("파일이 선택되지 않았습니다.");
        return;
      }

      // FormData 생성 및 파일 데이터 추가
      const formData = new FormData();
      formData.append("file", this.file);

      try {
        console.log("파일 전송 중...");

        // Axios를 사용하여 API 호출
        const response = await this.$axios.post("/api/efoto", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        // 서버 응답 데이터 처리
        if (response && response.data) {
          console.log("API 응답:", response.data);
          this.exercise_name = response.data.exercise_name 
          this.tonic = response.data.tonic
        } 
      } catch (error) {
        // API 호출 시 오류 처리
        console.error("API 요청 중 오류 발생:", error.message);
        if (error.response) {
          console.error("응답 상태 코드:", error.response.status);
          console.error("응답 데이터:", error.response.data);
          } 
      } 
    },
        // 새로운 페이지로 이동하는 메소드
        goToAnotherPage() {
          this.$router.push('/'); // 다른 페이지 경로로 이동
        },
  },
};
    /*

    methods: {
        async changeFile() {
            console.log("test")
            console.log(this.file)

            var response =await this.$axios.post("/api/efoto", {
                file:this.file
            },{
               headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            console.log(response.data)
            this.exercise_name = response.data.exercise_name
            this.Tonic = response.data.Tonic
          // 새로운 페이지로 이동하는 메소드
        goToAnotherPage() {
        this.$router.push('/'); // 다른 페이지 경로로 이동
          }  
        }
    }
}*/
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

/* 검은색 선 추가: 화면 상단부터 하단까지 이어지는 선 */
.side-line {
  position: absolute;
  top: -10;
  bottom: -10;
  width: 5px; /* 선의 너비 */
  background-color: #000000; /* 검은색 선 */
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
  gap: 10px; /* 입력창과 버튼 사이의 간격 */
  width: 110%;
  padding: 0 20px;
}

.larger-file-input {
  width: 200%;
  max-width: 500px; /* 파일 입력창을 더 넓게 설정하여 강조 */
  font-size: 1.3em; /* 폰트 크기를 적당하게 설정 */
  height: 70px;
}

.larger-button {
  width: 100%;
  max-width: 200px; /* 버튼을 더 넓게 설정 */
  padding: 20px; /* 버튼의 높이를 키워 사용자가 쉽게 클릭하도록 설정 */
  font-size: 1.2em; /* 버튼의 폰트 크기를 적당하게 설정 */
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

/* 메인 페이지로 이동하는 버튼 스타일 */
.navigate-button {
  width: 150%;
  max-width: 300px; /* 버튼의 최대 너비 설정 */
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

.info-section {
  width: 100%;
  max-width: 400px;
  margin-top: 30px;
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
    width: 150%; /* 작은 화면에서는 전체 너비 사용 */
  }

  .file-input-container {
    gap: 20px;
  }

  .larger-file-input,
  .larger-button {
    max-width: 100%; /* 작은 화면에서는 전체 너비 사용 */
    font-size: 1.1em; /* 폰트 크기를 적당히 조절 */
    padding: 15px; /* 충분한 터치 영역 유지 */
  }

  .info-section {
    padding: 15px;
    font-size: 0.9em;
  }
}
</style>
