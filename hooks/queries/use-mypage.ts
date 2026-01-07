// hooks/queries/use-mypage.ts
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { fetcher } from "@/lib/api";

import { PageResponse, StudyApplicantDto, StudyGroupItemDto, StudyGroupLikeParams, StudyGroupCommentedParams } from "@/types/study-group";
import { useToast } from "@/components/ui/use-toast";
// types/auth.ts에 정의된 MyPageInfoDto 사용
// GetHostedStudyGroupRes, GetJoinedStudyGroupRes 타입 정의 필요 (생략, 위 DTO 참고하여 생성)

export const useGetHostedStudyGroups = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["hostedStudyGroups"],
    queryFn: async () => {
      // 페이지네이션 파라미터가 필요하다면 인자로 받아 전달
      const res = await fetcher<PageResponse<StudyGroupItemDto>>("/mypage/hosted-study-groups?pageNumber=1&pageSize=100", {
        method: "GET",
        auth: true,
      });
      return res;
    },
    ...options,
  });
};

export const useGetJoinedStudyGroups = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["joinedStudyGroups"],
    queryFn: async () => {
      const res = await fetcher<PageResponse<StudyGroupItemDto>>("/mypage/joined-study-groups?pageNumber=1&pageSize=100", {
        method: "GET",
        auth: true,
      });
      return res;
    },
    ...options,
  });
};

// hooks/queries/use-mypage.ts 추가 내용

export const useGetLikedStudyGroups = (
  params: StudyGroupLikeParams,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["likedStudyGroups", params],
    queryFn: async () => {
      const res = await fetcher<PageResponse<StudyGroupItemDto>>(
        `/mypage/likes/posts?pageNumber=${params.pageNumber}&pageSize=${params.pageSize}`,
        { auth: true }
      );
      return res;
    },
    ...options,
  });
};

export const useGetCommentedStudyGroups = (
  params: StudyGroupCommentedParams,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["commentedStudyGroups", params],
    queryFn: async () => {
      const res = await fetcher<PageResponse<StudyGroupItemDto>>(
        `/mypage/commented/posts?pageNumber=${params.pageNumber}&pageSize=${params.pageSize}`,
        { auth: true }
      );
      return res;
    },
    ...options,
  });
};

// 신청자 목록 조회 (관리 페이지용)
export const useGetApplicants = (studyGroupId: string) => {
  return useQuery({
    queryKey: ["applicants", studyGroupId],
    queryFn: async () => {
      // 백엔드 수정 전이라도 일단 호출 구조 마련
      const res = await fetcher<PageResponse<StudyApplicantDto[]>>(`/mypage/applied/list/${studyGroupId}`, { auth: true });
      return res;
    },
    enabled: !!studyGroupId,
  });
};

// 신청 수락/거절
export const useManageApplicant = (studyGroupId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ userId, action }: { userId: number; action: "accept" | "reject" }) =>
      fetcher(`/mypage/${action}/${userId}/${studyGroupId}`, {
        method: "POST",
        auth: true,
      }),
    onSuccess: () => {
      toast({ title: "처리되었습니다." });
      queryClient.invalidateQueries({ queryKey: ["applicants", studyGroupId] });
    },
    onError: () => toast({ title: "처리 실패", variant: "destructive" }),
  });
};