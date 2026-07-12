import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Member } from "../data/types";

interface MembersTableProps {
  members: Member[];
  selectedIds: string[];
  onToggleSelectAll: () => void;
  onToggleSelect: (id: string) => void;
  onRowClick: (member: Member) => void;
}

export function MembersTable({ members, selectedIds, onToggleSelectAll, onToggleSelect, onRowClick }: MembersTableProps) {
  
  if (members.length === 0) {
    return (
      <div className="py-20 flex flex-col items-center justify-center bg-white">
        <div className="w-20 h-20 bg-[#f8fafc] rounded-full flex items-center justify-center mb-4 border border-[#dddddd]">
          <svg className="w-8 h-8 text-[#9297a0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-[#181d26] mb-1">No team members yet</h3>
        <p className="text-[14px] text-[#41454d]">Invite your first employee to start managing access.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto min-h-[550px]">
      <Table>
        <TableHeader className="bg-[#f8fafc] hover:bg-[#f8fafc] border-b border-[#dddddd]">
          <TableRow className="border-none hover:bg-transparent">
            <TableHead className="w-[50px] px-6">
              <Checkbox 
                checked={selectedIds.length === members.length && members.length > 0}
                onCheckedChange={onToggleSelectAll}
                className="border-[#9297a0] data-[state=checked]:bg-[#181d26] rounded-[4px]"
              />
            </TableHead>
            <TableHead className="text-[12px] font-medium uppercase tracking-wider text-[#41454d]">Profile</TableHead>
            <TableHead className="text-[12px] font-medium uppercase tracking-wider text-[#41454d]">Department</TableHead>
            <TableHead className="text-[12px] font-medium uppercase tracking-wider text-[#41454d]">Assigned Roles</TableHead>
            <TableHead className="text-[12px] font-medium uppercase tracking-wider text-[#41454d]">Status</TableHead>
            <TableHead className="text-[12px] font-medium uppercase tracking-wider text-[#41454d]">Last Login</TableHead>
            <TableHead className="text-[12px] font-medium uppercase tracking-wider text-[#41454d]">Joined</TableHead>
            <TableHead className="w-[80px] text-right px-6 text-[12px] font-medium uppercase tracking-wider text-[#41454d]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map(member => (
            <TableRow 
              key={member.id} 
              className="border-b border-[#dddddd] last:border-0 hover:bg-[#f8fafc] cursor-pointer transition-colors"
              onClick={() => onRowClick(member)}
            >
              <TableCell className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                <Checkbox 
                  checked={selectedIds.includes(member.id)}
                  onCheckedChange={() => onToggleSelect(member.id)}
                  className="border-[#9297a0] data-[state=checked]:bg-[#181d26] rounded-[4px]"
                />
              </TableCell>
              <TableCell className="py-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-9 h-9 border border-[#dddddd]">
                      <AvatarImage src={member.avatarUrl} />
                      <AvatarFallback className="bg-[#181d26] text-white text-xs">{member.firstName[0]}{member.lastName[0]}</AvatarFallback>
                    </Avatar>
                    <div className={`absolute bottom-0 right-[-2px] w-2.5 h-2.5 rounded-full border-2 border-white ${member.isOnline ? 'bg-[#137333]' : 'bg-[#9297a0]'}`} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[14px] font-medium text-[#181d26] leading-tight">{member.fullName}</span>
                    <span className="text-[12px] text-[#41454d] mt-0.5">{member.email}</span>
                    <span className="text-[11px] text-[#9297a0]">{member.employeeCode}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-4">
                <Badge variant="outline" className="text-[12px] font-normal text-[#181d26] border-[#dddddd] bg-white rounded-[6px] shadow-none py-0.5">
                  {member.department}
                </Badge>
              </TableCell>
              <TableCell className="py-4">
                <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                  {member.roles.map(r => (
                    <Badge key={r.id} variant="secondary" className="text-[11px] font-medium text-[#41454d] bg-[#e0e2e6] hover:bg-[#e0e2e6] rounded-[4px] shadow-none py-0.5 border-none">
                      {r.name}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell className="py-4">
                {member.status === 'active' && <Badge className="bg-[#e6f4ea] text-[#137333] hover:bg-[#e6f4ea] border-none shadow-none text-[11px] uppercase tracking-wider font-semibold">Active</Badge>}
                {member.status === 'pending' && <Badge className="bg-[#fef2e0] text-[#b06000] hover:bg-[#fef2e0] border-none shadow-none text-[11px] uppercase tracking-wider font-semibold">Pending</Badge>}
                {member.status === 'suspended' && <Badge className="bg-[#fce8e6] text-[#c5221f] hover:bg-[#fce8e6] border-none shadow-none text-[11px] uppercase tracking-wider font-semibold">Suspended</Badge>}
                {member.status === 'archived' && <Badge className="bg-[#e0e2e6] text-[#41454d] hover:bg-[#e0e2e6] border-none shadow-none text-[11px] uppercase tracking-wider font-semibold">Archived</Badge>}
              </TableCell>
              <TableCell className="py-4 text-[13px] text-[#181d26]">
                {member.lastLoginAt}
              </TableCell>
              <TableCell className="py-4 text-[13px] text-[#41454d]">
                {member.joinedDate}
              </TableCell>
              <TableCell className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-[6px] h-8 w-8 p-0 hover:bg-[#e0e2e6] hover:text-[#181d26] text-[#41454d] border-none bg-transparent outline-none">
                    <MoreHorizontal className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[180px] rounded-[10px] border-[#dddddd] shadow-lg bg-[#ffffff] p-1">
                    <DropdownMenuLabel className="text-[11px] font-medium text-[#9297a0] uppercase tracking-wider px-2 py-1.5">Actions</DropdownMenuLabel>
                    <DropdownMenuItem className="text-[13px] text-[#181d26] rounded-[6px] focus:bg-[#f8fafc] cursor-pointer" onClick={() => onRowClick(member)}>View Details</DropdownMenuItem>
                    <DropdownMenuItem className="text-[13px] text-[#181d26] rounded-[6px] focus:bg-[#f8fafc] cursor-pointer">Edit Profile</DropdownMenuItem>
                    <DropdownMenuItem className="text-[13px] text-[#181d26] rounded-[6px] focus:bg-[#f8fafc] cursor-pointer">Assign Role</DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-[#dddddd] my-1" />
                    {member.status !== 'suspended' ? (
                      <DropdownMenuItem className="text-[13px] text-[#c5221f] rounded-[6px] focus:bg-[#fce8e6] cursor-pointer">Suspend Member</DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem className="text-[13px] text-[#137333] rounded-[6px] focus:bg-[#e6f4ea] cursor-pointer">Activate Member</DropdownMenuItem>
                    )}
                    <DropdownMenuItem className="text-[13px] text-[#c5221f] rounded-[6px] focus:bg-[#fce8e6] cursor-pointer">Delete (Soft)</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
