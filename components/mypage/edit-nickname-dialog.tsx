
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface EditNicknameDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newNickname: string) => void;
  currentNickname: string;
}

export function EditNicknameDialog({ isOpen, onClose, onSave, currentNickname }: EditNicknameDialogProps) {
  const [nickname, setNickname] = useState(currentNickname);

  const handleSave = () => {
    onSave(nickname);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>닉네임 변경</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="새 닉네임을 입력하세요"
            className="bg-black border-gray-700"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>취소</Button>
          <Button onClick={handleSave}>저장</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
