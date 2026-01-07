"use client";

import { useState } from "react";
import { useGetStudyGroups } from "@/hooks/queries/use-study-group";
import { StudyCard } from "@/components/study-group/study-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { FIELD_LABEL, LOCATION_LABEL } from "@/constants/enums";
import { Search } from "lucide-react";
import Link from "next/link";

export default function StudyGroupListPage() {
  // 검색 필터 상태
  const [filters, setFilters] = useState({
    pageNumber: 1,
    pageSize: 12,
    title: "",
    field: "",
    location: "",
  });

  const { data, isLoading } = useGetStudyGroups(filters);
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = () => {
    setFilters((prev) => ({ ...prev, title: searchInput, pageNumber: 1 }));
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">스터디 찾기</h1>
            <p className="text-gray-400">함께 성장할 스터디 그룹을 찾아보세요.</p>
          </div>
          <Button asChild>
            <Link href="/study-groups/create">스터디 개설하기</Link>
          </Button>
        </div>

        {/* 필터링 섹션 */}
        <div className="bg-gray-900 p-4 rounded-lg mb-8 border border-gray-800 flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex gap-2">
             <Input 
               placeholder="스터디 제목 검색..." 
               className="bg-black border-gray-700"
               value={searchInput}
               onChange={(e) => setSearchInput(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
             />
             <Button size="icon" onClick={handleSearch}>
               <Search className="h-4 w-4" />
             </Button>
          </div>
          
          <div className="flex gap-2">
             {/* 분야 선택 */}
             <Select onValueChange={(val) => setFilters(prev => ({...prev, field: val === 'ALL' ? '' : val, pageNumber: 1}))}>
               <SelectTrigger className="w-[140px] bg-black border-gray-700">
                 <SelectValue placeholder="분야" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="ALL">전체</SelectItem>
                 {Object.entries(FIELD_LABEL).map(([key, label]) => (
                   <SelectItem key={key} value={key}>{label}</SelectItem>
                 ))}
               </SelectContent>
             </Select>

             {/* 지역 선택 */}
             <Select onValueChange={(val) => setFilters(prev => ({...prev, location: val === 'ALL' ? '' : val, pageNumber: 1}))}>
               <SelectTrigger className="w-[140px] bg-black border-gray-700">
                 <SelectValue placeholder="지역" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="ALL">전체</SelectItem>
                 {Object.entries(LOCATION_LABEL).map(([key, label]) => (
                   <SelectItem key={key} value={key}>{label}</SelectItem>
                 ))}
               </SelectContent>
             </Select>
          </div>
        </div>

        {/* 리스트 섹션 */}
        {isLoading ? (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
             {[...Array(8)].map((_, i) => (
               <Skeleton key={i} className="h-[250px] rounded-xl bg-gray-900" />
             ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
             {data?.content.map((study, index) => (
               <StudyCard key={study.id} data={study} />
             ))}
             
             {data?.content.length === 0 && (
               <div className="col-span-full text-center py-20 text-gray-500">
                 조건에 맞는 스터디 그룹이 없습니다.
               </div>
             )}
          </div>
        )}

        {/* 페이지네이션 (간단 구현) */}
        <div className="flex justify-center mt-12 gap-2">
           <Button 
             variant="outline" 
             disabled={filters.pageNumber <= 1}
             onClick={() => setFilters(prev => ({...prev, pageNumber: prev.pageNumber - 1}))}
           >
             이전
           </Button>
           <span className="flex items-center px-4 text-gray-400">
             Page {filters.pageNumber}
           </span>
           <Button 
             variant="outline" 
             disabled={data?.last}
             onClick={() => setFilters(prev => ({...prev, pageNumber: prev.pageNumber + 1}))}
           >
             다음
           </Button>
        </div>
      </main>
    </div>
  );
}