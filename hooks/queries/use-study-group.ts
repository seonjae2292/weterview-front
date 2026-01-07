// hooks/queries/use-study-group.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetcher, ApiError } from "@/lib/api";

import {
  StudyGroupSearchParams,
  PageResponse,
  StudyGroupItemDto,
  StudyGroupDetailDto,
  CommentDto
} from "@/types/study-group";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { CreateStudyGroupReq, UpdateStudyGroupReq } from "@/types/study-group";
import { getAccessToken } from "@/lib/utils";

// 게시글 생성
export const useCreateStudyGroup = () => {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStudyGroupReq) =>
      fetcher<{ id: number }>("/studygroup/create", {
        method: "POST",
        auth: true,
        body: JSON.stringify(data)
      }),
    onSuccess: (data) => {
      toast({ title: "스터디가 개설되었습니다." });
      queryClient.invalidateQueries({ queryKey: ["studyGroups"] });
      router.push(`/study-groups/detail/${data.id}`);
    },
    onError: (err) => toast({ title: "개설 실패", description: err.message, variant: "destructive" })
  });
};

// 목록 조회
export const useGetStudyGroups = (params: StudyGroupSearchParams) => {
  return useQuery({
    queryKey: ["studyGroups", params],
    queryFn: async () => {
      // 쿼리 파라미터 생성 - 개별 파라미터로 전송
      const queryParams: Record<string, string> = {
        pageNumber: params.pageNumber.toString(),
        pageSize: params.pageSize.toString(),
      };

      if (params.title) queryParams.title = params.title;
      if (params.field) queryParams.field = params.field;
      if (params.location) queryParams.location = params.location;
      if (params.status) queryParams.status = params.status;

      const query = new URLSearchParams(queryParams);

      const res = await fetcher<PageResponse<StudyGroupItemDto>>(
        `/studygroup/get?${query.toString()}`,
        { method: "GET", auth: true },
      );
      return res;
    },
    placeholderData: (previousData) => previousData, // 페이지 이동 시 깜빡임 방지
  });
};

// 상세 조회
export const useGetStudyGroupDetail = (id: string) => {
  // 토큰 존재 유무에 따라서 auth 설정 변경해야 한다.
  const isToken = getAccessToken() ? true : false;

  return useQuery({
    queryKey: ["studyGroup", id],
    queryFn: async () => {
      const res = await fetcher<StudyGroupDetailDto>(
        `/studygroup/get/${id}`,
        { method: "GET", auth: isToken }
      );
      return res;
    },
    enabled: !!id,
  });
};

// 댓글 조회
export const useGetComments = (id: string) => {
  return useQuery({
    queryKey: ["comments", id],
    queryFn: async () => {
      const res = await fetcher<CommentDto[]>(
        `/studygroup/get/comment/${id}`,
        { method: "GET", auth: false }
      );
      return res;
    },
    enabled: !!id,
  });
};

// 좋아요 / 좋아요 취소
export const useToggleLike = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      return fetcher<{ isLiked: boolean }>(`/studygroup/${id}/likes`, { method: "POST", auth: true });
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["studyGroup", id] });
      const previousStudyGroup = queryClient.getQueryData<StudyGroupDetailDto>(["studyGroup", id]);

      if (previousStudyGroup) {
        queryClient.setQueryData<StudyGroupDetailDto>(["studyGroup", id], {
          ...previousStudyGroup,
          isLiked: !previousStudyGroup.isLiked,
        });
      }
      return { previousStudyGroup };
    },
    onError: (err, variables, context) => {
      if (context?.previousStudyGroup) {
        queryClient.setQueryData(["studyGroup", id], context.previousStudyGroup);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["studyGroup", id] });
      queryClient.invalidateQueries({ queryKey: ["likedStudyGroups"] });
    },
  });
};

// 참여 신청
export const useJoinStudyGroup = () => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: (studyGroupId: string) =>
      fetcher(`/studygroup/join/${studyGroupId}`, {
        method: "POST",
        auth: true,
      }),
    onSuccess: () => toast({ title: "참여 신청이 완료되었습니다." }),
    onError: (error: any) => {
      if (error instanceof ApiError) {
        toast({ title: "신청 실패", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "신청 실패", description: "알 수 없는 오류가 발생했습니다.", variant: "destructive" });
      }
    }
  });
};


// 스터디 삭제
export const useDeleteStudyGroup = () => {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      fetcher(`/studygroup/delete/${id}`, {
        method: "DELETE",
        auth: true,
      }),
    onSuccess: () => {
      toast({ title: "삭제되었습니다." });
      queryClient.invalidateQueries({ queryKey: ["studyGroups"] });
      router.push("/study-groups");
    }
  });
};

// 댓글 작성
export const useCreateComment = (studyGroupId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (contents: string) =>
      fetcher("/studygroup/create/comment", {
        method: "POST",
        auth: true,
        body: JSON.stringify({ studyGroupId, contents })
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", studyGroupId] });
      toast({ title: "댓글이 등록되었습니다." });
    },
    onError: (err) => toast({ title: "댓글 등록 실패", description: err.message, variant: "destructive" })
  });
};

// 스터디 수정
export const useUpdateStudyGroup = (id: string) => {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateStudyGroupReq) =>
      fetcher(`/studygroup/update/${id}`, {
        method: "PATCH",
        auth: true,
        body: JSON.stringify(data)
      }),
    onSuccess: () => {
      toast({ title: "수정되었습니다." });
      queryClient.invalidateQueries({ queryKey: ["studyGroup", id] });
      router.push(`/study-groups/detail/${id}`);
    },
    onError: (err) => toast({ title: "수정 실패", description: err.message, variant: "destructive" })
  });
};

// 인기 있는 스터디
export const usePopularStudyGroups = (params: StudyGroupSearchParams) => {
  return useQuery({
    queryKey: ["studyGroups", params],
    queryFn: async () => {
      // 쿼리 파라미터 생성
      const query = new URLSearchParams({
        pageNumber: params.pageNumber.toString(),
        pageSize: params.pageSize.toString(),
      });

      const res = await fetcher<PageResponse<StudyGroupItemDto>>(
        `/studygroup/popular?${query.toString()}`,
        { method: "GET", auth: false } // 목록 조회는 토큰 없이 가능하면 false, 필수면 true
      );
      return res;
    },
    placeholderData: (previousData) => previousData, // 페이지 이동 시 깜빡임 방지
  });
};

// 최신 스터디 
export const useLatestStudyGroups = ({ count }: { count: number }) => {
  return useQuery({
    queryKey: ["studyGroups", count],
    queryFn: async () => {
      // 쿼리 파라미터 생성
      const query = new URLSearchParams({
        count: count.toString(),
      });

      const res = await fetcher<StudyGroupItemDto[]>(
        `/studygroup/latest?${query.toString()}`,
        { method: "GET", auth: false } // 목록 조회는 토큰 없이 가능하면 false, 필수면 true
      );
      return res;
    },
    placeholderData: (previousData) => previousData, // 페이지 이동 시 깜빡임 방지
  });
};