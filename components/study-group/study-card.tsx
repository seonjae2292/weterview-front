// components/study-group/study-card.tsx
import Link from "next/link";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users } from "lucide-react";
import { FIELD_LABEL, LOCATION_LABEL, STATUS_LABEL, STATUS_COLOR } from "@/constants/enums";
import { format } from "date-fns";

interface StudyCardProps {
  // 백엔드 DTO 필드명이 id가 아닌 경우를 대비해 id는 별도 prop으로 받거나 DTO 확장
  id: string; 
  data: {
    title: string;
    subTitle: string;
    field: string;
    location: string;
    status: string;
    recruitingNumber: number;
    totalNumber: number;
    startDate: string;
    endDate: string;
  }
}

export function StudyCard({ id, data }: StudyCardProps) {
  // 날짜 포맷팅 (YYYY-MM-DD)
  const formatDate = (dateStr: string) => {
    try { return format(new Date(dateStr), "yyyy-MM-dd"); } 
    catch { return dateStr; }
  };

  return (
    <Link href={`/study-groups/detail?id=${id}`}>
      <Card className="h-full flex flex-col bg-gray-900 border-gray-800 hover:border-primary/50 transition-colors overflow-hidden group">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start mb-2">
            <Badge variant="outline" className="text-xs border-gray-700 text-gray-300">
              {FIELD_LABEL[data.field] || data.field}
            </Badge>
            <Badge variant={STATUS_COLOR[data.status] || "secondary"}>
              {STATUS_LABEL[data.status] || data.status}
            </Badge>
          </div>
          <h3 className="font-bold text-lg text-white group-hover:text-primary transition-colors line-clamp-1">
            {data.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {data.subTitle}
          </p>
        </CardHeader>
        
        <CardContent className="flex-1 text-sm space-y-2">
          <div className="flex items-center text-gray-400 gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span>{LOCATION_LABEL[data.location] || data.location}</span>
          </div>
          <div className="flex items-center text-gray-400 gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <span>{formatDate(data.startDate)} ~ {formatDate(data.endDate)}</span>
          </div>
        </CardContent>

        <CardFooter className="pt-0 border-t border-gray-800 mt-3 pt-3">
          <div className="flex items-center text-gray-400 gap-2 w-full">
             <Users className="w-4 h-4" />
             <span className="text-xs">
               모집 인원 {data.recruitingNumber} / {data.totalNumber}
             </span>
             {/* 진행률 바 같은거 추가 가능 */}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}