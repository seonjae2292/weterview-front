// hooks/queries/use-mypage.ts
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { fetcher } from "@/lib/api";
import { ApiResponse } from "@/types/auth";
import { StudyApplicantDto } from "@/types/study-group";
import { useToast } from "@/components/ui/use-toast";
// types/auth.ts에 정의된 MyPageInfoDto 사용
// GetHostedStudyGroupRes, GetJoinedStudyGroupRes 타입 정의 필요 (생략, 위 DTO 참고하여 생성)

export const useGetHostedStudyGroups = () => {
  return useQuery({
    queryKey: ["hostedStudyGroups"],
    queryFn: async () => {
      // 페이지네이션 파라미터가 필요하다면 인자로 받아 전달
      const res = await fetcher<ApiResponse<any[]>>("/mypage/hosted-study-groups?pageNumber=1&pageSize=100", {
        method: "GET",
        auth: true,
      });
      return res.data;
    },
  });
};

export const useGetJoinedStudyGroups = () => {
  return useQuery({
    queryKey: ["joinedStudyGroups"],
    queryFn: async () => {
      const res = await fetcher<ApiResponse<any[]>>("/mypage/joined-study-groups?pageNumber=1&pageSize=100", {
        method: "GET",
        auth: true,
      });
      return res.data;
    },
  });
};

// hooks/queries/use-mypage.ts 추가 내용

// 좋아요한 스터디
export const useGetLikedStudyGroups = () => {
  return useQuery({
    queryKey: ["likedStudyGroups"],
    queryFn: async () => {
      const res = await fetcher<ApiResponse<any[]>>("/mypage/liked-study-groups?pageNumber=1&pageSize=100", { auth: true });
      return res.data;
    },
  });
};

// 댓글 단 스터디
export const useGetCommentedStudyGroups = () => {
  return useQuery({
    queryKey: ["commentedStudyGroups"],
    queryFn: async () => {
      const res = await fetcher<ApiResponse<any[]>>("/mypage/commented-study-groups?pageNumber=1&pageSize=100", { auth: true });
      return res.data;
    },
  });
};

// 신청자 목록 조회 (관리 페이지용)
export const useGetApplicants = (studyGroupId: string) => {
  return useQuery({
    queryKey: ["applicants", studyGroupId],
    queryFn: async () => {
      // 백엔드 수정 전이라도 일단 호출 구조 마련
      const res = await fetcher<ApiResponse<StudyApplicantDto[]>>(`/mypage/applied/list/${studyGroupId}`, { auth: true });
      return res.data;
    },
    enabled: !!studyGroupId,
  });
};

// 신청 수락/거절
export const useManageApplicant = (studyGroupId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ userId, studyGroupId, action }: { userId: number, studyGroupId: number; action: "accept" | "reject" }) => 
      fetcher(`/mypage/${action}/${userId}/${studyGroupId}`, { // API 경로가 membershipId를 타겟팅한다고 가정
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