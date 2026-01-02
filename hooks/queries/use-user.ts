
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetcher } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";


export const useUpdateNickname = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (nickname: string) =>
      fetcher<any>("/mypage/update/nickname", {
        method: "PATCH",
        auth: true,
        body: JSON.stringify({ nickname }),
      }),
    onSuccess: () => {
      toast({ title: "닉네임이 변경되었습니다." });
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
    },
    onError: (error) => {
      console.error("Nickname Update Error:", error);
      toast({ title: "닉네임 변경 실패", description: "다시 시도해주세요.", variant: "destructive" });
    },
  });
};
