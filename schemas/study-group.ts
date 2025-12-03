import * as z from "zod";

export const studyGroupSchema = z.object({
  title: z.string().min(2, "제목은 2글자 이상이어야 합니다."),
  subTitle: z.string().min(2, "부제목을 입력해주세요."),
  field: z.string().min(1, "분야를 선택해주세요."),
  location: z.string().min(1, "지역을 선택해주세요."),
  recruitingNumber: z.coerce.number().min(1, "모집 인원은 1명 이상이어야 합니다."),
  totalNumber: z.coerce.number().min(2, "총 인원은 2명 이상이어야 합니다."),
  startDate: z.date({ error: "시작일을 선택해주세요." }),
  endDate: z.date({ error: "종료일을 선택해주세요." }),
  description: z.string().min(10, "상세 설명은 10자 이상 입력해주세요."),
  schedule: z.string().min(2, "진행 일정을 입력해주세요."),
  joinCondition: z.string().min(2, "참여 조건을 입력해주세요."),
  contact: z.string().min(2, "연락처/문의처를 입력해주세요."),
  status: z.string().optional(),
});

export type StudyGroupSchema = z.infer<typeof studyGroupSchema>;
