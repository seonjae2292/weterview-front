// types/study-group.ts

// 공통 페이지네이션 응답 구조 (Spring Page<T>)
export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number; // 현재 페이지 번호 (0-based index일 수 있음, 백엔드 확인 필요)
  first: boolean;
  last: boolean;
  empty: boolean;
}

// 목록 조회용 아이템 (GetStudyGroupPageRes)
export interface StudyGroupItemDto {
  id?: number | string; // 백엔드 DTO 확인 필요, 없을 경우 대비
  field: string;
  status: string;
  title: string;
  subTitle: string;
  location: string;
  description: string;
  recruitingNumber: number;
  totalNumber: number;
  startDate: string;
  endDate: string;
}

// 상세 조회용 (GetStudyGroupByIdRes / GetStudyGroupDetailRes)
export interface StudyGroupDetailDto {
  id: string;
  field: string;
  status: string;
  title: string;
  subTitle: string;
  recruitingNumber: number;
  totalNumber: number;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  schedule: string;
  joinCondition: string;
  contact: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

// 댓글 (GetCommentRes)
export interface CommentDto {
  content: string;
  createdAt: string;
  nickname: string;
}
export interface StudyGroupCommentDto {
  nickname: string;
  content: string;
  createdAt: string; // LocalDateTime -> string
}

// [NEW] 스터디 생성/수정 요청 (Form 데이터 구조)
export interface CreateStudyGroupSchema {
  field: string;        // Enum
  title: string;
  subTitle: string;
  recruitingNumber: number;
  totalNumber: number;
  startDate: Date;      // Date 객체로 관리하다가 API 전송 시 ISO String 변환
  endDate: Date;
  location: string;     // Enum
  description: string;
  schedule: string;
  joinCondition: string;
  contact: string;
}

// 스터디 생성 요청 (CreateStudyGroupReq)
export interface CreateStudyGroupReq {
  field: string;
  title: string;
  subTitle: string;
  recruitingNumber: number;
  totalNumber: number;
  startDate: string; // yyyy-MM-ddTHH:mm:ss
  endDate: string;   // yyyy-MM-ddTHH:mm:ss
  location: string;
  description: string;
  schedule: string;
  joinCondition: string;
  contact: string;
}

// 검색 파라미터
export interface StudyGroupSearchParams {
  pageNumber: number;
  pageSize: number;
  title?: string;
  field?: string;
  location?: string;
  status?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// 신청자 관리용 DTO
export interface StudyApplicantDto {
  userId: number;
  nickname: string;
  kakaoEmail: string; // 연락처 대용
  createdAt: string;
  status: "APPLY" | "ACCEPT" | "REFUSE";
}

// 수정용 DTO (기존 CreateStudyGroupReq와 유사하지만 status 포함 가능)
export interface UpdateStudyGroupReq extends Partial<CreateStudyGroupReq> {
  status?: "RECRUITING" | "CLOSED" | "DELETED";
}