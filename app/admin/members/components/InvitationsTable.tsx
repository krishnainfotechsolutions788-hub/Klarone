import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Invitation } from "../data/types";

interface InvitationsTableProps {
  invitations: Invitation[];
  onRevoke?: (id: string) => void;
}

export function InvitationsTable({ invitations, onRevoke }: InvitationsTableProps) {
  
  if (invitations.length === 0) {
    return (
      <div className="py-20 flex flex-col items-center justify-center bg-white">
        <div className="w-20 h-20 bg-[#f8fafc] rounded-full flex items-center justify-center mb-4 border border-[#dddddd]">
          <svg className="w-8 h-8 text-[#9297a0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-[#181d26] mb-1">No pending invitations</h3>
        <p className="text-[14px] text-[#41454d]">Invite someone to join your workspace.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto min-h-[550px]">
      <Table>
        <TableHeader className="bg-[#f8fafc] hover:bg-[#f8fafc] border-b border-[#dddddd]">
          <TableRow className="border-none hover:bg-transparent">
            <TableHead className="text-[12px] font-medium uppercase tracking-wider text-[#41454d] pl-6">Invitee</TableHead>
            <TableHead className="text-[12px] font-medium uppercase tracking-wider text-[#41454d]">Department</TableHead>
            <TableHead className="text-[12px] font-medium uppercase tracking-wider text-[#41454d]">Invited By</TableHead>
            <TableHead className="text-[12px] font-medium uppercase tracking-wider text-[#41454d]">Status</TableHead>
            <TableHead className="text-[12px] font-medium uppercase tracking-wider text-[#41454d]">Invitation Date</TableHead>
            <TableHead className="text-[12px] font-medium uppercase tracking-wider text-[#41454d]">Expires</TableHead>
            <TableHead className="w-[80px] text-right px-6 text-[12px] font-medium uppercase tracking-wider text-[#41454d]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invitations.map(invite => (
            <TableRow 
              key={invite.id} 
              className="border-b border-[#dddddd] last:border-0 hover:bg-[#f8fafc] transition-colors"
            >
              <TableCell className="py-4 pl-6">
                <div className="flex flex-col">
                  <span className="text-[14px] font-medium text-[#181d26] leading-tight">
                    {invite.firstName} {invite.lastName}
                  </span>
                  <span className="text-[12px] text-[#41454d] mt-0.5">{invite.email}</span>
                </div>
              </TableCell>
              <TableCell className="py-4">
                <Badge variant="outline" className="text-[12px] font-normal text-[#181d26] border-[#dddddd] bg-white rounded-[6px] shadow-none py-0.5">
                  {invite.department}
                </Badge>
              </TableCell>
              <TableCell className="py-4 text-[13px] text-[#41454d]">
                {invite.invitedBy}
              </TableCell>
              <TableCell className="py-4">
                {invite.status === 'Pending' && <Badge className="bg-[#fef2e0] text-[#b06000] hover:bg-[#fef2e0] border-none shadow-none text-[11px] uppercase tracking-wider font-semibold">Pending</Badge>}
                {invite.status === 'Accepted' && <Badge className="bg-[#e6f4ea] text-[#137333] hover:bg-[#e6f4ea] border-none shadow-none text-[11px] uppercase tracking-wider font-semibold">Accepted</Badge>}
                {invite.status === 'Expired' && <Badge className="bg-[#fce8e6] text-[#c5221f] hover:bg-[#fce8e6] border-none shadow-none text-[11px] uppercase tracking-wider font-semibold">Expired</Badge>}
                {invite.status === 'Revoked' && <Badge className="bg-[#e0e2e6] text-[#41454d] hover:bg-[#e0e2e6] border-none shadow-none text-[11px] uppercase tracking-wider font-semibold">Revoked</Badge>}
              </TableCell>
              <TableCell className="py-4 text-[13px] text-[#181d26]">
                {invite.createdAt}
              </TableCell>
              <TableCell className="py-4 text-[13px] text-[#41454d]">
                {invite.expiresAt}
              </TableCell>
              <TableCell className="px-6 py-4 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-[6px] h-8 w-8 p-0 hover:bg-[#e0e2e6] hover:text-[#181d26] text-[#41454d] border-none bg-transparent outline-none">
                    <MoreHorizontal className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[180px] rounded-[10px] border-[#dddddd] shadow-lg bg-[#ffffff] p-1">
                    <div className="text-[11px] font-medium text-[#9297a0] uppercase tracking-wider px-2 py-1.5 cursor-default">Actions</div>
                    
                    {invite.status === 'Pending' && (
                      <>
                        <DropdownMenuItem className="text-[13px] text-[#181d26] rounded-[6px] focus:bg-[#f8fafc] cursor-pointer">Resend Invitation</DropdownMenuItem>
                        <DropdownMenuItem className="text-[13px] text-[#181d26] rounded-[6px] focus:bg-[#f8fafc] cursor-pointer">Copy Invitation Link</DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-[#dddddd] my-1" />
                        <DropdownMenuItem 
                          onClick={() => onRevoke && onRevoke(invite.id)}
                          className="text-[13px] text-[#c5221f] rounded-[6px] focus:bg-[#fce8e6] cursor-pointer"
                        >
                          Delete Invitation
                        </DropdownMenuItem>
                      </>
                    )}
                    
                    <DropdownMenuItem className="text-[13px] text-[#181d26] rounded-[6px] focus:bg-[#f8fafc] cursor-pointer">View Details</DropdownMenuItem>
                    
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
