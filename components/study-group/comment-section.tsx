"use client";

import { useState } from "react";
import { useGetComments, useCreateComment } from "@/hooks/queries/use-study-group";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { MessageSquare } from "lucide-react";

export function CommentSection({ studyGroupId }: { studyGroupId: string }) {
  const { data: comments, isLoading } = useGetComments(studyGroupId);
  const { mutate: createComment, isPending } = useCreateComment(studyGroupId);
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (!content.trim()) return;
    createComment(content, {
      onSuccess: () => setContent(""), // 성공 시 입력창 초기화
    });
  };

  const formatDate = (dateStr: string) => {
    try { return format(new Date(dateStr), "yyyy.MM.dd HH:mm"); } 
    catch { return ""; }
  };

  return (
    <div className="mt-12 pt-8 border-t border-gray-800">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <MessageSquare className="w-5 h-5" />
        댓글 <span className="text-primary">{comments?.length || 0}</span>
      </h3>

      {/* 댓글 작성 폼 */}
      <div className="flex gap-4 mb-10">
        <Avatar className="w-10 h-10 hidden sm:block">
          <AvatarFallback className="bg-gray-800 text-gray-400">ME</AvatarFallback>
        </Avatar>
        <div className="flex-1 gap-2 flex flex-col items-end">
          <Textarea 
            placeholder="스터디에 대해 궁금한 점을 남겨보세요." 
            className="bg-gray-900 border-gray-800 min-h-[80px] resize-none focus-visible:ring-primary"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Button 
            size="sm" 
            onClick={handleSubmit} 
            disabled={!content.trim() || isPending}
          >
            {isPending ? "등록 중..." : "댓글 등록"}
          </Button>
        </div>
      </div>

      {/* 댓글 목록 */}
      <div className="space-y-6">
        {isLoading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="w-10 h-10 rounded-full bg-gray-900" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-24 bg-gray-900" />
                <Skeleton className="h-4 w-full bg-gray-900" />
              </div>
            </div>
          ))
        ) : comments && comments.length > 0 ? (
          comments.map((comment, idx) => (
            <div key={idx} className="flex gap-4">
              <Avatar className="w-10 h-10 border border-gray-800">
                <AvatarFallback className="bg-gray-800 text-xs">
                  {comment.nickname.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">{comment.nickname}</span>
                  <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                </div>
                <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-500 bg-gray-900/30 rounded-lg">
            아직 작성된 댓글이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}