import { StudyGroupItemDto } from "@/types/study-group";
import Link from "next/link";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Heart } from "lucide-react";
import { FIELD_LABEL, LOCATION_LABEL, STATUS_LABEL, STATUS_COLOR } from "@/constants/enums";
import { format } from "date-fns";

interface StudyCardProps {
  data: StudyGroupItemDto;
}

export function StudyCard({ data }: StudyCardProps) {
  // 날짜 포맷팅 (YYYY-MM-DD)
  const formatDate = (dateStr: string) => {
    try { return format(new Date(dateStr), "yyyy-MM-dd"); } 
    catch { return dateStr; }
  };

  return (
    <Link href={`/study-groups/detail/${data.studyGroupId}`}>
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
            <span>{formatDate(data.createdAt)}</span>
          </div>
        </CardContent>

        <CardFooter className="pt-0 border-t border-gray-800 mt-3 pt-3 flex justify-between">
          <div className="flex items-center text-gray-400 gap-2">
             <Users className="w-4 h-4" />
             <span className="text-xs">
               {data.currentMemberCount} / {data.maxMemberCount}
             </span>
          </div>
          <div className="flex items-center text-gray-400 gap-1">
            <Heart className="w-4 h-4" />
            <span className="text-xs">{data.likeCount}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}