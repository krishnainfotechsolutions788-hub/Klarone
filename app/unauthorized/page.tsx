import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-sm border border-slate-100 text-center">
        <div className="flex justify-center">
          <div className="h-20 w-20 bg-red-50 rounded-full flex items-center justify-center">
            <ShieldAlert className="h-10 w-10 text-red-500" />
          </div>
        </div>
        <div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
            Access Denied
          </h2>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            You do not have the required permissions to view this page or perform this action.
            If you believe this is a mistake, please contact your system administrator.
          </p>
        </div>
        
        <div className="pt-4">
          <Button render={<Link href="/admin" />} className="w-full bg-black text-white hover:bg-slate-800">
            Return to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
