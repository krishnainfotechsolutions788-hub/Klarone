"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function AcceptInvitePage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    // In a real app, you'd extract the token from the URL search params
    // const params = new URLSearchParams(window.location.search);
    // const token = params.get("token");
    
    // Simulate API call to accept invitation
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
    }, 1500);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4">
        <Card className="w-full max-w-md shadow-lg border-[#dddddd] rounded-[12px]">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-12 h-12 bg-[#e6f4ea] rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#137333]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <CardTitle className="text-2xl font-bold text-[#181d26]">Account Created!</CardTitle>
            <CardDescription className="text-[14px] text-[#41454d] mt-2">
              Your account has been successfully created and your invitation accepted.
            </CardDescription>
          </CardHeader>
          <CardFooter className="pt-6">
            <Button className="w-full h-11 bg-[#181d26] hover:bg-[#0d1218] text-white rounded-[6px]" onClick={() => window.location.href = '/'}>
              Go to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4">
      <Card className="w-full max-w-md shadow-lg border-[#dddddd] rounded-[12px]">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-[#181d26]">Accept Invitation</CardTitle>
          <CardDescription className="text-[14px] text-[#41454d]">
            You have been invited to join the Klarone workspace. Please create a password to set up your account.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 bg-[#fce8e6] text-[#c5221f] text-[13px] rounded-[6px] border border-[#fbdad7]">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[13px] font-medium text-[#181d26]">Create Password</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 text-[14px] border-[#dddddd] rounded-[6px] focus-visible:ring-[#1b61c9]" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-[13px] font-medium text-[#181d26]">Confirm Password</Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                required 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-11 text-[14px] border-[#dddddd] rounded-[6px] focus-visible:ring-[#1b61c9]" 
              />
            </div>
            <div className="flex items-start gap-2 pt-2">
              <input type="checkbox" id="terms" required className="mt-1" />
              <label htmlFor="terms" className="text-[12px] text-[#41454d]">
                I agree to the Klarone Terms of Service and Privacy Policy.
              </label>
            </div>
          </CardContent>
          <CardFooter className="pt-2 pb-6">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-11 bg-[#181d26] hover:bg-[#0d1218] text-white rounded-[6px] font-medium"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
