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