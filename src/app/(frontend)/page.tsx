'use client'
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button";
import { Toaster } from "react-hot-toast";
import BehaviorLogModal from "./components/BehaviorLog/BehaviorLogModal";
import { useBehaviorLogs } from "@/hooks/useBehaviorLogsTable";
import { useBehaviorLogsActions } from "@/hooks/useBehaviorLogsActions";
import { BehaviorLogsActions } from "./components/Table/BehaviorLogsActions";
import { BehaviorLogsTable } from "./components/Table/BehaviorLogsTable";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // State management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateSort, setDateSort] = useState<'desc' | 'asc'>('desc');

  const {
    logs,
    totalItems,
    loading,
    error,
    selectedIds,
    toggleSelection,
    clearSelection,
    refetch
  } = useBehaviorLogs({
    page: currentPage,
    limit: 10,
    status: statusFilter,
    sortOrder: dateSort
  });
  
  const { updateStatus } = useBehaviorLogsActions();

  useEffect(() => {
    if (status === "unauthenticated" || !session) {
      router.push("/login")
    }
  }, [status, session, router]);

  // Handler functions
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    clearSelection();
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
    clearSelection();
  };

  const handleDateSort = (direction: 'asc' | 'desc') => {
    setDateSort(direction);
    clearSelection();
  };

  const handleSuccess = () => {
    clearSelection();
    refetch();
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">บันทึกพฤติกรรม</h1>
        <div className="flex gap-2">
          <Button onClick={() => setIsModalOpen(true)}>
            บันทึกพฤติกรรม
          </Button>
          {session.user.role === 'Admin' && selectedIds.length > 0 && (
            <BehaviorLogsActions
              selectedIds={selectedIds}
              onUpdateStatus={updateStatus}
              onSuccess={handleSuccess}
            />
          )}
        </div>
      </div>

      <BehaviorLogsTable
        logs={logs}
        selectedIds={selectedIds}
        onToggleSelection={toggleSelection}
        totalItems={totalItems}
        currentPage={currentPage}
        itemsPerPage={10}
        onPageChange={handlePageChange}
        onStatusChange={handleStatusChange}
        onDateSort={handleDateSort}
      />

      <BehaviorLogModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={refetch}
      />

      <Toaster position="top-right" />
    </div>
  );
}