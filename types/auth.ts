export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

export interface OurMemberDto {
  id: number;
  email: string;
  name: string;
  role: "GUEST" | "USER";
  accessToken: string;
  refreshToken: string;
}

export interface SignupInfoDto {
  realName: string;
  nickname: string;
  birthDate: string; // YYYY-MM-DD
  gender: "MALE" | "FEMALE";
  email: string;
}