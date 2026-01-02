import * as z from "zod";

export const studyGroupSchema = z.object({
  title: z.string().min(2, "제목은 2글자 이상이어야 합니다."),
  subTitle: z.string().min(2, "부제목을 입력해주세요."),
  field: z.string().min(1, "분야를 선택해주세요."),
  location: z.string().min(1, "지역을 선택해주세요."),
  maxMemberCount: z.coerce.number().min(2, "총 인원은 2명 이상이어야 합니다."),
  startDate: z.date({ error: "시작일을 선택해주세요." }),
  endDate: z.date({ error: "종료일을 선택해주세요." }),
  description: z.string().min(10, "상세 설명은 10자 이상 입력해주세요."),
  schedule: z.string().min(2, "진행 일정을 입력해주세요."),
  status: z.string().optional(),
}).refine(data => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return data.startDate >= today;
}, {
  message: "모집 시작일은 현재 날짜보다 이전이 될 수 없습니다.",
  path: ["startDate"],
}).refine(data => {
  const oneDayInMs = 1000 * 60 * 60 * 24;
  return data.endDate.getTime() - data.startDate.getTime() >= oneDayInMs;
}, {
  message: "모집 마감일은 모집 시작일보다 하루 이상 이후여야 합니다.",
  path: ["endDate"],
});

export type StudyGroupSchema = z.infer<typeof studyGroupSchema>;
