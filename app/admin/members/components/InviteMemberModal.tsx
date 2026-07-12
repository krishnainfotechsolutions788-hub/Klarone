import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { inviteMember } from "../actions";
import { Copy, CheckCircle2 } from "lucide-react";

interface InviteMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteMemberModal({ open, onOpenChange }: InviteMemberModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [emailErrorMsg, setEmailErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setEmailErrorMsg(null);
    
    const formData = new FormData(e.currentTarget);
    const result = await inviteMember(formData);
    
    setIsLoading(false);
    
    if (result.error) {
      setErrorMsg(result.error);
    } else if (result.inviteLink) {
      setInviteLink(result.inviteLink);
      if (result.emailError) {
        setEmailErrorMsg(result.emailError);
      }
    } else {
      onOpenChange(false);
    }
  };

  const handleCopy = () => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const resetAndClose = () => {
    setInviteLink(null);
    setErrorMsg(null);
    setEmailErrorMsg(null);
    setCopied(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(val) => { if (!val) resetAndClose(); else onOpenChange(val); }}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-[#dddddd] shadow-lg rounded-[12px] bg-white">
        
        <div className="px-6 py-4 border-b border-[#dddddd] bg-[#f8fafc]">
          <DialogTitle className="text-lg font-semibold text-[#181d26]">
            {inviteLink ? "Invitation Processed" : "Invite Member"}
          </DialogTitle>
          <DialogDescription className="text-[13px] text-[#41454d] mt-1">
            {inviteLink 
              ? "The invitation link has been generated."
              : "Send an invitation link for a new employee to join the workspace."}
          </DialogDescription>
        </div>
        
        {inviteLink ? (
          <div className="p-6 space-y-6">
            {emailErrorMsg ? (
              <div className="flex flex-col items-center justify-center py-4 gap-3 text-center">
                <div className="w-12 h-12 bg-[#fef2e0] rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#b06000]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[#181d26] font-medium text-[15px]">Invitation Generated, But Email Failed</p>
                  <p className="text-[#b06000] text-[13px] mt-1">{emailErrorMsg}</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-4 gap-3">
                <div className="w-12 h-12 bg-[#e6f4ea] rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-[#137333]" />
                </div>
                <p className="text-[#181d26] font-medium text-[15px]">Invitation Sent Successfully</p>
              </div>
            )}
            
            <div className="space-y-2">
              <Label className="text-[12px] font-medium text-[#41454d]">Invitation Link (For Local Testing)</Label>
              <div className="flex items-center gap-2">
                <Input 
                  readOnly 
                  value={inviteLink} 
                  className="h-10 text-[13px] bg-[#f8fafc] border-[#dddddd] focus-visible:ring-0 focus-visible:ring-offset-0" 
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCopy}
                  className="h-10 px-3 border-[#dddddd] shrink-0"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4 text-[#137333]" /> : <Copy className="w-4 h-4 text-[#41454d]" />}
                </Button>
              </div>
              <p className="text-[11px] text-[#9297a0]">
                In a production environment, this link would be automatically emailed to the user.
              </p>
            </div>
            
            <div className="pt-2">
              <Button type="button" onClick={resetAndClose} className="w-full h-10 bg-[#181d26] hover:bg-[#0d1218] text-white">
                Done
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {errorMsg && (
              <div className="p-3 bg-[#fce8e6] text-[#c5221f] text-[13px] rounded-[6px] border border-[#fbdad7]">
                {errorMsg}
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[12px] font-medium text-[#181d26]">First Name</Label>
                <Input name="firstName" required className="h-9 text-[13px] border-[#dddddd] rounded-[6px] focus-visible:ring-[#1b61c9] shadow-none" placeholder="Jane" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[12px] font-medium text-[#181d26]">Last Name</Label>
                <Input name="lastName" required className="h-9 text-[13px] border-[#dddddd] rounded-[6px] focus-visible:ring-[#1b61c9] shadow-none" placeholder="Smith" />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <Label className="text-[12px] font-medium text-[#181d26]">Email Address</Label>
              <Input name="email" type="email" required className="h-9 text-[13px] border-[#dddddd] rounded-[6px] focus-visible:ring-[#1b61c9] shadow-none" placeholder="jane.smith@klarone.com" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[12px] font-medium text-[#181d26]">Department</Label>
                <Select name="department">
                  <SelectTrigger className="h-9 text-[13px] border-[#dddddd] rounded-[6px] shadow-none focus:ring-[#1b61c9]">
                    <SelectValue placeholder="Select dept" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[12px] font-medium text-[#181d26]">Assign Role</Label>
                <Select name="role">
                  <SelectTrigger className="h-9 text-[13px] border-[#dddddd] rounded-[6px] shadow-none focus:ring-[#1b61c9]">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#dddddd]">
              <Button type="button" variant="outline" onClick={resetAndClose} className="h-9 px-4 text-[13px] border-[#dddddd] rounded-[6px] shadow-none">
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="h-9 px-4 text-[13px] bg-[#181d26] hover:bg-[#0d1218] text-white rounded-[6px] shadow-none">
                {isLoading ? "Sending..." : "Send Invitation"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
