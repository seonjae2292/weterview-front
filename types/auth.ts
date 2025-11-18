export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

export interface OurMemberDto {
  kakaoUniqueId: string;
  kakaoEmail: string;
  name: string;
  isOurMember: boolean;
  accessToken: string;
  refreshToken: string;
}
export interface SignupInfoDto {
  kakaoUserNumber: string;
  kakaoEmail: string;
  nickname: string;
  gender: "MALE" | "FEMALE";
  // birthDate: string; // YYYY-MM-DD
}

// 마이페이지 정보 응답 타입
export interface MyPageInfoDto {
  createdAt: string;    // LocalDateTime은 JSON string으로 옴 (ISO 8601)
  updatedAt: string;    // LocalDateTime
  kakaoEmail: string;
  nickname: string;
  gender: string;       // "MALE" | "FEMALE"
}