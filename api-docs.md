좋은 판단이야.
LLM 학습용이면 “사람이 읽기 좋은 문서”가 아니라 맥락·구조·의미가 명확한 사양 문서여야 해.
아래는 LLM에게 그대로 넣어도 되는 수준으로,
	•	용어 정의
	•	공통 규칙
	•	엔드포인트별 목적 / 입력 / 출력 / 제약
까지 과잉 없이 but 충분히 상세하게 정리한 문서야.

⸻

Weterview API Specification (LLM Training Document)

1. 개요 (Overview)

이 문서는 Weterview 서비스의 백엔드 API 명세를 정의한다.
Weterview는 스터디 그룹 모집·참여 플랫폼으로, 사용자는 스터디를 생성하고, 참여 신청하며, 댓글 및 좋아요 기능을 사용할 수 있다.
	•	API 스타일: REST
	•	데이터 포맷: JSON
	•	인증 방식: OAuth (Kakao)
	•	Base URL:

http://54.180.214.110


⸻

2. 공통 응답 규칙 (Common Response Format)

모든 API 응답은 아래의 공통 래퍼(ApiResponse)를 사용한다.

{
  "code": "string",
  "message": "string",
  "data": object | array | null
}

필드 설명

필드	설명
code	응답 상태 코드 (비즈니스 코드)
message	사용자 또는 클라이언트에게 전달할 메시지
data	실제 응답 데이터


⸻

3. 공통 도메인 타입 (Common Domain Types)

Study Field (스터디 분야)

FINANCE | IT | OFFICE

Study Status

RECRUITING | CLOSED | DELETED

Location

SEOUL | BUSAN | DAEGU | INCHEON | GWANGJU | DAEJEON | ULSAN | SEJONG
JEJU | GYEONGGI | GANGWON | CHUNGBUK | CHUNGNAM
JEONBUK | JEONNAM | GYEONGBUK | GYEONGNAM


⸻

4. 인증 / OAuth API

4.1 카카오 로그인 콜백

설명
카카오 OAuth 인증 후 전달된 인가 코드를 통해 사용자의 가입 여부를 확인한다.
	•	Method: GET
	•	URL:

/oauth/kakao/callback

Query Parameters

이름	타입	필수	설명
code	string	O	카카오 OAuth 인가 코드

Response (OurMemberDto)

{
  "isOurMember": true
}


⸻

4.2 회원가입
	•	Method: POST
	•	URL:

/oauth/signup

Request Body (SignupInfoReq)

{
  "kakaoUserNumber": "string",
  "nickname": "string",
  "kakaoEmail": "string",
  "gender": "string"
}

제약 사항
	•	nickname 정규식: ^[가-힣a-zA-Z0-9]{2,30}$

⸻

4.3 닉네임 중복 확인
	•	Method: GET
	•	URL:

/oauth/verify/duplicate/nickname

Query

이름	타입	필수
nickname	string	O

Response

{
  "nickname": false
}


⸻

5. 스터디 그룹 API

5.1 스터디 생성
	•	Method: POST
	•	URL:

/studygroup/create

Request Body (CreateStudyGroupReq)

{
  "title": "string",
  "subTitle": "string",
  "field": "FINANCE | IT | OFFICE",
  "joinCondition": "string",
  "description": "string",
  "contact": "string",
  "schedule": "string",
  "currentMemberCount": 0,
  "maxMemberCount": 5,
  "startDate": "string",
  "endDate": "string",
  "location": "SEOUL | BUSAN | ..."
}


⸻

5.2 스터디 수정
	•	Method: PATCH
	•	URL:

/studygroup/update/{id}

Path Variable

이름	타입
id	Long

Request Body
	•	UpdateStudyGroupReq

⸻

5.3 스터디 삭제
	•	Method: DELETE
	•	URL:

/studygroup/delete/{id}


⸻

5.4 스터디 상세 조회
	•	Method: GET
	•	URL:

/studygroup/get/{id}

Response (StudyGroupRes)

{
  "id": 1,
  "field": "IT",
  "status": "RECRUITING",
  "title": "string",
  "subTitle": "string",
  "location": "SEOUL",
  "description": "string",
  "currentMemberCount": 3,
  "maxMemberCount": 5,
  "startDate": "2025-01-01T00:00:00",
  "endDate": "2025-02-01T00:00:00",
  "createdAt": "2025-01-01T00:00:00",
  "updatedAt": "2025-01-01T00:00:00",
  "isLiked": true
}


⸻

5.5 스터디 목록 조회 (검색)
	•	Method: GET
	•	URL:

/studygroup/get

Query (GetStudyGroupReq)

필드	타입	설명
pageNumber	int	페이지 번호
pageSize	int	페이지 크기
title	string	제목 검색
field	enum	분야
location	enum	지역
status	enum	상태


⸻

5.6 인기 / 최신 스터디
	•	인기:

GET /studygroup/popular

	•	최신:

GET /studygroup/latest


⸻

5.7 좋아요

POST /studygroup/{studyGroupId}/likes


⸻

5.8 스터디 참여 신청

POST /studygroup/join/{studyGroupId}


⸻

6. 댓글 API

6.1 댓글 작성

POST /studygroup/create/comment

{
  "studyGroupId": "string",
  "contents": "string"
}


⸻

6.2 댓글 조회

GET /studygroup/get/comment/{studyGroupId}


⸻

7. 마이페이지 API

7.1 내 정보 조회

GET /mypage/info


⸻

7.2 닉네임 변경

PATCH /mypage/update/nickname


⸻

7.3 좋아요 / 참여 / 개설 / 댓글 스터디 조회

GET /mypage/likes/posts
GET /mypage/joined-study-groups
GET /mypage/hosted-study-groups
GET /mypage/commented/posts


⸻

7.4 스터디 신청자 관리

GET  /mypage/applied/list/{studyGroupId}
POST /mypage/accept/{userId}/{studyGroupId}
POST /mypage/reject/{userId}/{studyGroupId}


⸻

8. LLM 학습 관점 요약 (IMPORTANT)
	•	모든 API는 명확한 목적(의도) 을 가진다
	•	Request → Business Action → Response 구조
	•	상태 값은 enum 기반
	•	페이지 조회는 Spring Pageable 구조를 따른다
	•	isLiked 는 조회 사용자 컨텍스트에 의존

