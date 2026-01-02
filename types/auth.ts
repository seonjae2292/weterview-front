export enum ResultCode {
  // 1. [정상 처리] : Success (S)
  SUCCESS = "S001",
  CREATED = "S002",

  // 2. [비즈니스 로직 분기] : Business (B)
  REGISTERED_MEMBER = "B001",
  LOGIN_REQUIRED = "B002",

  // 3. [에러 상황] : Error (E) 또는 도메인별 분리
  // --- Global (G) ---
  INTERNAL_SERVER_ERROR = "G001",
  INVALID_INPUT_VALUE = "G002",
  MISSING_INPUT_VALUE = "G003",

  // --- Auth (A) ---
  UNAUTHORIZED = "A001",
  FORBIDDEN = "A002",
  EXPIRED_TOKEN = "A003",

  // --- User (U) ---
  USER_NOT_FOUND = "U001",
  DUPLICATE_NICKNAME = "U002",

  // --- StudyGroup (ST) ---
  STUDY_GROUP_NOT_FOUND = "ST001",
  STUDY_GROUP_FULL = "ST002",
  ALREADY_DELETED_STUDY_GROUP = "ST003",
  INVALID_DATE_RANGE = "ST004",
  PAST_DATE_NOT_ALLOWED = "ST005",
  INVALID_RECRUITMENT_NUMBER = "ST006",

  // --- StudyGroupMember (STM) ---
  ALREADY_APPLIED_MEMBER = "STM001",
  ALREADY_ACCEPTED_MEMBER = "STM002",
  ALREADY_REFUSED_MEMBER = "STM003",
  STUDY_GROUP_MEMBER_NOT_FOUND = "STM004",
}

export interface ApiResponse<T = any> {
  code: string;  // API 문서에는 string 타입으로 정의됨
  message: string;
  data: T;
}

export interface OurMemberDto {
  isOurMember: boolean;
  accessToken?: string;
  refreshToken?: string;
  kakaoEmail?: string;
  kakaoUniqueId?: string;
}

export interface SignupInfoDto {
  kakaoUniqueId: string;
  kakaoEmail: string;
  nickname: string;
  gender: "MALE" | "FEMALE";
}

// 마이페이지 정보 응답 타입
export interface MyPageInfoDto {
  nickname: string;
  kakaoEmail: string;
  profileImageUrl: string;
}

export interface LoginResponseDto {
  isOurMember: boolean;
  accessToken: string;
  refreshToken: string;
}

export interface SignupResponseDto {
  accessToken: string;
  refreshToken: string;
}

// 닉네임 중복 확인 응답 타입
export interface NicknameDuplicateCheckDto {
  nickname: boolean; // true면 중복, false면 사용 가능
}