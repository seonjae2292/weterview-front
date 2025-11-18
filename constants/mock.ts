// constants/mock.ts
import { StudyGroupItemDto } from "@/types/study-group";

export const FEATURED_STUDY_GROUPS: StudyGroupItemDto[] = [
  {
    id: "mock-1",
    field: "IT",
    status: "RECRUITING",
    title: "🚀 프론트엔드 개발자 면접 스터디",
    subTitle: "기술 면접부터 인성 면접까지 함께 대비해요!",
    location: "SEOUL",
    description: "매주 토요일 강남역 오프라인 모임",
    recruitingNumber: 2,
    totalNumber: 6,
    startDate: "2024-05-01T10:00:00",
    endDate: "2024-06-30T18:00:00",
  },
  {
    id: "mock-2",
    field: "FINANCE",
    status: "RECRUITING",
    title: "CFA Level 1 대비반",
    subTitle: "금융권 취업을 위한 자격증 스터디입니다.",
    location: "ONLINE",
    description: "평일 저녁 줌 미팅 진행",
    recruitingNumber: 1,
    totalNumber: 4,
    startDate: "2024-05-10T19:00:00",
    endDate: "2024-08-01T22:00:00",
  },
  {
    id: "mock-3",
    field: "OFFICE",
    status: "CLOSED",
    title: "데이터 분석 기초 (Python)",
    subTitle: "비전공자를 위한 데이터 분석 입문",
    location: "BUSAN",
    description: "주 1회 서면 스터디룸",
    recruitingNumber: 4,
    totalNumber: 4,
    startDate: "2024-04-01T14:00:00",
    endDate: "2024-05-30T16:00:00",
  },
];