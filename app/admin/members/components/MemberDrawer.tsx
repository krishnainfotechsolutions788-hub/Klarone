import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Monitor, Smartphone, Globe, Clock, ShieldAlert, KeyRound, UserMinus } from "lucide-react";
import { Member, Session, AuditLog } from "../data/types";
import { getMemberDetails } from "../actions";
import { useState, useEffect } from "react";

interface MemberDrawerProps {
  member: Member | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MemberDrawer({ member, open, onOpenChange }: MemberDrawerProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open && member?.id) {
      setIsLoading(true);
      getMemberDetails(member.id).then((res) => {
        setSessions(res.sessions as Session[]);
        setAuditLogs(res.auditLogs as AuditLog[]);
      }).finally(() => {
        setIsLoading(false);
      });
    }
  }, [open, member]);

  if (!member) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[600px] w-full p-0 flex flex-col bg-[#ffffff] border-l border-[#dddddd] shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-[#dddddd] bg-[#f8fafc] flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="w-16 h-16 border-2 border-white shadow-sm">
                  <AvatarImage src={member.avatarUrl} />
                  <AvatarFallback className="bg-[#181d26] text-white text-lg">
                    {member.firstName[0]}{member.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${member.isOnline ? 'bg-[#137333]' : 'bg-[#9297a0]'}`} />
              </div>
              <div>
                <SheetTitle className="text-xl font-bold text-[#181d26] leading-none mb-1">{member.fullName}</SheetTitle>
                <SheetDescription className="text-sm text-[#41454d]">
                  {member.designation} • {member.department}
                </SheetDescription>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[12px] font-medium text-[#9297a0] bg-[#e0e2e6] px-2 py-0.5 rounded-[4px]">{member.employeeCode}</span>
                  {member.status === 'active' && <Badge className="bg-[#e6f4ea] text-[#137333] hover:bg-[#e6f4ea] border-none shadow-none text-[11px] uppercase tracking-wider font-semibold">Active</Badge>}
                  {member.status === 'suspended' && <Badge className="bg-[#fce8e6] text-[#c5221f] hover:bg-[#fce8e6] border-none shadow-none text-[11px] uppercase tracking-wider font-semibold">Suspended</Badge>}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-8 shadow-none border-[#dddddd] rounded-[6px] text-[#41454d]">
                Edit
              </Button>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <Tabs defaultValue="overview" className="flex-1 flex flex-col w-full h-full">
            <div className="px-6 border-b border-[#dddddd]">
              <TabsList className="bg-transparent h-12 p-0 space-x-6 border-none">
                <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#181d26] data-[state=active]:text-[#181d26] rounded-none px-0 h-full text-[14px] text-[#9297a0] font-medium">Overview</TabsTrigger>
                <TabsTrigger value="roles" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#181d26] data-[state=active]:text-[#181d26] rounded-none px-0 h-full text-[14px] text-[#9297a0] font-medium">Roles</TabsTrigger>
                <TabsTrigger value="sessions" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#181d26] data-[state=active]:text-[#181d26] rounded-none px-0 h-full text-[14px] text-[#9297a0] font-medium">Sessions</TabsTrigger>
                <TabsTrigger value="timeline" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#181d26] data-[state=active]:text-[#181d26] rounded-none px-0 h-full text-[14px] text-[#9297a0] font-medium">Activity Timeline</TabsTrigger>
                <TabsTrigger value="audit" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#181d26] data-[state=active]:text-[#181d26] rounded-none px-0 h-full text-[14px] text-[#9297a0] font-medium">Audit Logs</TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-white">
              {/* Overview Tab */}
              <TabsContent value="overview" className="m-0 space-y-6">
                <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                  <div>
                    <label className="text-[12px] font-medium text-[#9297a0] uppercase tracking-wider mb-1 block">Email</label>
                    <p className="text-[14px] text-[#181d26]">{member.email}</p>
                  </div>
                  <div>
                    <label className="text-[12px] font-medium text-[#9297a0] uppercase tracking-wider mb-1 block">Phone</label>
                    <p className="text-[14px] text-[#181d26]">{member.phone}</p>
                  </div>
                  <div>
                    <label className="text-[12px] font-medium text-[#9297a0] uppercase tracking-wider mb-1 block">Branch</label>
                    <p className="text-[14px] text-[#181d26]">{member.branch}</p>
                  </div>
                  <div>
                    <label className="text-[12px] font-medium text-[#9297a0] uppercase tracking-wider mb-1 block">Account Created</label>
                    <p className="text-[14px] text-[#181d26]">{member.joinedDate}</p>
                  </div>
                  <div>
                    <label className="text-[12px] font-medium text-[#9297a0] uppercase tracking-wider mb-1 block">Last Login</label>
                    <p className="text-[14px] text-[#181d26]">{member.lastLoginAt}</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#dddddd] flex flex-col gap-3">
                  <h4 className="text-[14px] font-semibold text-[#181d26]">Quick Actions</h4>
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1 h-9 shadow-none text-[13px] border-[#dddddd] text-[#181d26] rounded-[6px]">
                      <KeyRound className="w-4 h-4 mr-2" />
                      Reset Password
                    </Button>
                    <Button variant="outline" className="flex-1 h-9 shadow-none text-[13px] border-[#fce8e6] bg-[#fce8e6] text-[#c5221f] hover:bg-[#fbdad7] rounded-[6px]">
                      <UserMinus className="w-4 h-4 mr-2" />
                      Suspend Member
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Roles Tab */}
              <TabsContent value="roles" className="m-0 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-[14px] font-semibold text-[#181d26]">Assigned Roles</h4>
                  <Button size="sm" variant="outline" className="h-8 shadow-none border-[#dddddd] rounded-[6px] text-[12px]">Assign Role</Button>
                </div>
                {member.roles.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {member.roles.map(r => (
                      <div key={r.id} className="p-3 border border-[#dddddd] rounded-[8px] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-[6px] bg-[#f8fafc] flex items-center justify-center border border-[#dddddd]">
                            <ShieldAlert className="w-4 h-4 text-[#41454d]" />
                          </div>
                          <div>
                            <p className="text-[14px] font-medium text-[#181d26] leading-none">{r.name}</p>
                            <p className="text-[12px] text-[#9297a0] mt-1">54 permissions</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-[#c5221f] hover:bg-[#fce8e6] text-[12px]">Remove</Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[13px] text-[#41454d]">No roles assigned.</p>
                )}
              </TabsContent>

              {/* Sessions Tab */}
              <TabsContent value="sessions" className="m-0 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-[14px] font-semibold text-[#181d26]">Active Sessions</h4>
                  <Button size="sm" variant="outline" className="h-8 shadow-none border-[#fce8e6] bg-[#fce8e6] text-[#c5221f] hover:bg-[#fbdad7] rounded-[6px] text-[12px]">Terminate All</Button>
                </div>
                {isLoading ? (
                  <p className="text-[13px] text-[#41454d]">Loading sessions...</p>
                ) : sessions.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {sessions.map(s => (
                      <div key={s.id} className="p-3 border border-[#dddddd] rounded-[8px] flex items-start gap-3">
                        <div className="w-8 h-8 shrink-0 rounded-[6px] bg-[#f8fafc] flex items-center justify-center border border-[#dddddd] mt-0.5">
                          {s.device?.toLowerCase().includes('mac') ? <Monitor className="w-4 h-4 text-[#41454d]" /> : <Smartphone className="w-4 h-4 text-[#41454d]" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <p className="text-[14px] font-medium text-[#181d26] leading-none">{s.device} • {s.browser}</p>
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-[#c5221f] hover:bg-[#fce8e6] text-[11px] leading-none">Terminate</Button>
                          </div>
                          <div className="flex flex-col gap-1 mt-2 text-[12px] text-[#41454d]">
                            <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> {s.ip} ({s.location})</span>
                            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Last active: {s.lastActivity}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[13px] text-[#41454d]">No active sessions.</p>
                )}
              </TabsContent>

              {/* Timeline Tab */}
              <TabsContent value="timeline" className="m-0 space-y-4">
                <h4 className="text-[14px] font-semibold text-[#181d26]">Activity Timeline</h4>
                <div className="relative border-l border-[#dddddd] ml-3 mt-4 flex flex-col gap-6 pb-4">
                  {member.activityTimeline?.map((act, i) => (
                    <div key={act.id} className="pl-6 relative">
                      <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full bg-[#1b61c9] border-2 border-white" />
                      <p className="text-[13px] font-medium text-[#181d26] leading-none">{act.title}</p>
                      <p className="text-[12px] text-[#9297a0] mt-1">{act.date}</p>
                    </div>
                  ))}
                  {(!member.activityTimeline || member.activityTimeline.length === 0) && (
                    <p className="pl-6 text-[13px] text-[#41454d]">No recent activity.</p>
                  )}
                </div>
              </TabsContent>

              {/* Audit Logs Tab */}
              <TabsContent value="audit" className="m-0 space-y-4">
                <h4 className="text-[14px] font-semibold text-[#181d26]">Audit Logs</h4>
                {isLoading ? (
                  <p className="text-[13px] text-[#41454d]">Loading logs...</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {auditLogs.map(log => (
                      <div key={log.id} className="p-3 border border-[#dddddd] rounded-[6px] bg-[#f8fafc]">
                        <div className="flex justify-between items-start">
                          <p className="text-[13px] font-medium text-[#181d26]">{log.action}</p>
                          <span className="text-[11px] text-[#9297a0]">{log.date}</span>
                        </div>
                        <p className="text-[12px] text-[#41454d] mt-1">Entity: {log.entity}</p>
                      </div>
                    ))}
                    {auditLogs.length === 0 && (
                      <p className="text-[13px] text-[#41454d]">No audit logs available.</p>
                    )}
                  </div>
                )}
              </TabsContent>

            </div>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
