"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from "@/components/ui/select";
import type { BehaviorType } from "@/types";

interface Props {
 behaviors: BehaviorType[];
 onSelect: (behavior: BehaviorType) => void;
 loading: boolean;
}

export function BehaviorSelection({ behaviors, onSelect, loading }: Props) {
 // state สำหรับการค้นหา
 const [searchTerm, setSearchTerm] = useState("");
 const [isSearching, setIsSearching] = useState(false);

 // กรองพฤติกรรมตามการค้นหา
 const filteredBehaviors = behaviors.filter((behavior) =>
   behavior.name.toLowerCase().includes(searchTerm.toLowerCase())
 );

 // แยกพฤติกรรมตามประเภท
 const positiveBehaviors = filteredBehaviors.filter(
   (b) => b.category === "positive"
 );
 const negativeBehaviors = filteredBehaviors.filter(
   (b) => b.category === "negative"
 );

 // Debounce การค้นหา
 useEffect(() => {
   const timer = setTimeout(() => {
     setIsSearching(searchTerm.length > 0);
   }, 300);
   return () => clearTimeout(timer);
 }, [searchTerm]);

 return (
   <div className="w-full max-w-xl mx-auto space-y-3">
     {/* ช่องค้นหา */}
     <div className="relative">
       <Input
         type="text"
         placeholder="พิมพ์เพื่อค้นหาพฤติกรรม..."
         value={searchTerm}
         onChange={(e) => setSearchTerm(e.target.value)}
         className="w-full rounded-lg px-4 py-2.5 text-base"
       />
       {isSearching && (
         <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400">
           {filteredBehaviors.length} รายการ
         </div>
       )}
     </div>

     <Select
       onValueChange={(value) => {
         const behavior = behaviors.find((b) => b.id === parseInt(value));
         if (behavior) {
           onSelect(behavior);
           setSearchTerm("");
         }
       }}
       disabled={loading}
     >
       <SelectTrigger className="w-full rounded-lg border-2 hover:border-gray-400 transition-colors">
         <SelectValue
           placeholder={loading ? "กำลังโหลด..." : "เลือกพฤติกรรม"}
           className="text-base"
         />
       </SelectTrigger>

       <SelectContent className="w-[var(--radix-select-trigger-width)] max-h-[60vh]">
         <div className="px-1 py-2">
           {/* พฤติกรรมเชิงบวก */}
           {positiveBehaviors.length > 0 && (
             <div className="mb-3">
               <div className="px-3 py-1.5 text-sm font-medium text-gray-500 bg-gray-50 rounded-md mb-1">
                 พฤติกรรมเชิงบวก
               </div>
               {positiveBehaviors.map((behavior) => (
                 <SelectItem
                   key={behavior.id}
                   value={behavior.id.toString()}
                   className="rounded-md my-0.5 px-3 py-2 hover:bg-gray-50 transition-colors cursor-pointer"
                 >
                   <div className="flex justify-between items-center gap-4">
                     <span className="truncate">{behavior.name}</span>
                     <span className="text-green-600 font-medium whitespace-nowrap">
                       +{behavior.score}
                     </span>
                   </div>
                 </SelectItem>
               ))}
             </div>
           )}

           {/* พฤติกรรมเชิงลบ */}
           {negativeBehaviors.length > 0 && (
             <div className="mb-2">
               <div className="px-3 py-1.5 text-sm font-medium text-gray-500 bg-gray-50 rounded-md mb-1">
                 พฤติกรรมเชิงลบ
               </div>
               {negativeBehaviors.map((behavior) => (
                 <SelectItem
                   key={behavior.id}
                   value={behavior.id.toString()}
                   className="rounded-md my-0.5 px-3 py-2 hover:bg-gray-50 transition-colors cursor-pointer"
                 >
                   <div className="flex justify-between items-center gap-4">
                     <span className="truncate">{behavior.name}</span>
                     <span className="text-red-600 font-medium whitespace-nowrap">
                       {behavior.score}
                     </span>
                   </div>
                 </SelectItem>
               ))}
             </div>
           )}

           {/* กรณีไม่พบผลการค้นหา */}
           {filteredBehaviors.length === 0 && searchTerm && (
             <div className="p-4 text-center text-gray-500">
               ไม่พบพฤติกรรมที่ตรงกับ {searchTerm};
             </div>
           )}
         </div>
       </SelectContent>
     </Select>

     {/* แสดงจำนวนพฤติกรรมที่พบ */}
     {searchTerm && (
       <div className="text-sm text-gray-500 text-center">
         {positiveBehaviors.length > 0 && (
           <span className="text-green-600">
             พฤติกรรมบวก: {positiveBehaviors.length}
           </span>
         )}
         {positiveBehaviors.length > 0 && negativeBehaviors.length > 0 && (
           <span className="mx-2">•</span>
         )}
         {negativeBehaviors.length > 0 && (
           <span className="text-red-600">
             พฤติกรรมลบ: {negativeBehaviors.length}
           </span>
         )}
       </div>
     )}
   </div>
 );
}