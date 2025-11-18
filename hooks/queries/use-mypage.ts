// hooks/queries/use-mypage.ts
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/api";
import { ApiResponse } from "@/types/auth";
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