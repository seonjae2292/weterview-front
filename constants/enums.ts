export const FIELD_LABEL: Record<string, string> = {
  FINANCE: "금융",
  IT: "IT",
  OFFICE: "사무직",
};

export const LOCATION_LABEL: Record<string, string> = {
  SEOUL: "서울특별시",
  BUSAN: "부산광역시",
  DAEGU: "대구광역시",
  INCHEON: "인천광역시",
  GWANGJU: "광주광역시",
  DAEJEON: "대전광역시",
  ULSAN: "울산광역시",
  SEJONG: "세종특별자치시",
  JEJU: "제주특별자치도",
  GYEONGGI: "경기도",
  GANGWON: "강원도",
  CHUNGBUK: "충청북도",
  CHUNGNAM: "충청남도",
  JEONBUK: "전라북도",
  JEONNAM: "전라남도",
  GYEONGBUK: "경상북도",
  GYEONGNAM: "경상남도",
};

export const STATUS_LABEL: Record<string, string> = {
  RECRUITING: "모집중",
  CLOSED: "모집마감",
  DELETED: "삭제됨",
};

// 상태에 따른 뱃지 색상 매핑
export const STATUS_COLOR: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  RECRUITING: "default", // Primary Color
  CLOSED: "secondary",   // Gray
  DELETED: "destructive", // Red
};