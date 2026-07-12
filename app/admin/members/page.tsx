"use client";

import { useState, useEffect } from "react";
import { Search, Filter, ChevronDown, UserPlus, RefreshCw, FileDown, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

import { Member, Invitation } from "./data/types";
import { SummaryCards } from "./components/SummaryCards";
import { InvitationsSummaryCards } from "./components/InvitationsSummaryCards";
import { MembersTable } from "./components/MembersTable";
import { InvitationsTable } from "./components/InvitationsTable";
import { MemberDrawer } from "./components/MemberDrawer";
import { InviteMemberModal } from "./components/InviteMemberModal";
import { Pagination as StandardPagination } from "../components/Pagination";

import { getMembers, getInvitations, getMemberMetrics, getInvitationMetrics } from "./actions";

export default function AdminMembersPage() {
  const [activeTab, setActiveTab] = useState("members");
  
  // Data States
  const [members, setMembers] = useState<Member[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Metrics
  const [memberMetrics, setMemberMetrics] = useState({ total: 0, active: 0, suspended: 0, online: 0, pending: 0 });
  const [invitationMetrics, setInvitationMetrics] = useState({ pending: 0, accepted: 0, expired: 0, revoked: 0 });
  
  // Filtering & Pagination
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // UI States
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Fetch Data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === "members") {
        const result = await getMembers(page, 10, search, filter);
        setMembers(result.data);
        setTotalPages(result.totalPages);
        const mMetrics = await getMemberMetrics();
        setMemberMetrics(mMetrics);
      } else {
        const result = await getInvitations(page, 10, search, filter);
        setInvitations(result.data);
        setTotalPages(result.totalPages);
        const iMetrics = await getInvitationMetrics();
        setInvitationMetrics(iMetrics);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, page, filter, search]);

  const handleFilterChange = (val: string | null) => {
    if (!val) return;
    const [newTab, ...rest] = val.split('-');
    const newFilter = rest.join('-');
    setActiveTab(newTab);
    setFilter(newFilter);
    setPage(1);
    setSelectedIds([]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === members.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(members.map(m => m.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selId => selId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleRowClick = (member: Member) => {
    setSelectedMember(member);
    setIsDrawerOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-10">
      
      <div className="w-full flex flex-col gap-6">
        
        {/* Dynamic Summary Cards */}
        {activeTab === "members" ? (
          <SummaryCards metrics={memberMetrics} onFilter={(f) => handleFilterChange(`members-${f}`)} />
        ) : (
          <InvitationsSummaryCards metrics={invitationMetrics} onFilter={(f) => handleFilterChange(`invitations-${f}`)} />
        )}

        {/* Main Table Card */}
        <Card className="border-[#dddddd] shadow-none rounded-[10px] overflow-hidden p-0 gap-0">
          
          {/* Table Toolbar Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between p-4 border-b border-[#dddddd] bg-[#ffffff] gap-4">
            
            {/* Left Side: Search and Tabs */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
              <div className="relative w-full sm:w-[320px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9297a0]" />
                <input 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..." 
                  className="w-full h-9 pl-9 pr-4 bg-[#f8fafc] border border-[#dddddd] rounded-[6px] text-[13px] text-[#181d26] outline-none focus:border-[#1b61c9] transition-colors placeholder:text-[#9297a0]"
                />
              </div>
            </div>
            
            {/* Right Side: Filters and Actions */}
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
              {activeTab === "members" && (
                <Button variant="outline" className="h-9 px-3 rounded-[6px] border-[#dddddd] text-[#181d26] text-[13px] hover:bg-[#f8fafc] shadow-none flex items-center gap-1.5">
                  Bulk Actions <ChevronDown className="w-3.5 h-3.5 text-[#9297a0]" />
                </Button>
              )}
              
              <Select value={`${activeTab}-${filter}`} onValueChange={handleFilterChange}>
                <SelectTrigger className="h-9 w-[180px] rounded-[6px] border-[#dddddd] shadow-none text-[#181d26] text-[13px] hover:bg-[#f8fafc]">
                  <SelectValue placeholder="Filter..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Members</SelectLabel>
                    <SelectItem value="members-all">All Members</SelectItem>
                    <SelectItem value="members-active">Active Members</SelectItem>
                    <SelectItem value="members-suspended">Suspended Members</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Invitations</SelectLabel>
                    <SelectItem value="invitations-all">All Invitations</SelectItem>
                    <SelectItem value="invitations-Pending">Pending</SelectItem>
                    <SelectItem value="invitations-Accepted">Accepted</SelectItem>
                    <SelectItem value="invitations-Expired">Expired</SelectItem>
                    <SelectItem value="invitations-Revoked">Revoked</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Button onClick={fetchData} variant="outline" className="h-9 px-3 rounded-[6px] border-[#dddddd] text-[#181d26] text-[13px] hover:bg-[#f8fafc] shadow-none flex items-center gap-1.5" title="Refresh">
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              
              <Button onClick={() => setIsInviteModalOpen(true)} className="h-9 px-4 rounded-[6px] bg-[#181d26] hover:bg-[#0d1218] text-white text-[13px] font-medium shadow-none flex items-center gap-1.5">
                <UserPlus className="w-3.5 h-3.5" />
                Invite Member
              </Button>
            </div>
          </div>
          
          {/* Contextual Toolbar for Selection */}
          {activeTab === "members" && selectedIds.length > 0 && (
            <div className="px-4 py-3 bg-[#f8fafc] border-b border-[#dddddd] flex items-center gap-3">
              <span className="text-[13px] text-[#1b61c9] font-medium bg-[#e8f0fe] px-2 py-1 rounded-[6px]">
                {selectedIds.length} members selected
              </span>
            </div>
          )}
          

          <CardContent className="p-0">
            {activeTab === "members" && (
              <div className="m-0 border-none outline-none">
                {isLoading ? (
                  <div className="py-20 flex justify-center">
                    <RefreshCw className="w-8 h-8 text-[#9297a0] animate-spin" />
                  </div>
                ) : (
                  <>
                    <MembersTable 
                      members={members}
                      selectedIds={selectedIds}
                      onToggleSelectAll={toggleSelectAll}
                      onToggleSelect={toggleSelect}
                      onRowClick={handleRowClick}
                    />
                    {members.length > 0 && (
                      <div className="border-t border-[#dddddd] bg-[#ffffff]">
                        <StandardPagination 
                          currentPage={page} 
                          totalPages={totalPages} 
                          onPageChange={setPage} 
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {activeTab === "invitations" && (
              <div className="m-0 border-none outline-none">
                {isLoading ? (
                  <div className="py-20 flex justify-center">
                    <RefreshCw className="w-8 h-8 text-[#9297a0] animate-spin" />
                  </div>
                ) : (
                  <>
                    <InvitationsTable 
                      invitations={invitations} 
                      onRevoke={async (id) => {
                        if (confirm("Are you sure you want to delete this invitation?")) {
                          const { deleteInvitation } = await import('./actions');
                          const res = await deleteInvitation(id);
                          if (res.error) alert("Failed to delete: " + res.error);
                          else fetchData();
                        }
                      }}
                    />
                    {invitations.length > 0 && (
                      <div className="border-t border-[#dddddd] bg-[#ffffff]">
                        <StandardPagination 
                          currentPage={page} 
                          totalPages={totalPages} 
                          onPageChange={setPage} 
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>

      </div>

      <InviteMemberModal 
        open={isInviteModalOpen} 
        onOpenChange={(open) => {
          setIsInviteModalOpen(open);
          if (!open) fetchData();
        }} 
      />
      
      <MemberDrawer 
        open={isDrawerOpen} 
        onOpenChange={setIsDrawerOpen} 
        member={selectedMember} 
      />

    </div>
  );
}
