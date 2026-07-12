"use client";

import { useState } from "react";
import { Search, Plus, MoreVertical, Edit2, Shield, Trash2, Mail, Ban, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function UsersManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const users = [
    { 
      id: "u1", 
      name: "Admin User", 
      email: "admin@klarone.com", 
      role: "Super Admin", 
      status: "Active", 
      lastLogin: "2 mins ago" 
    },
    { 
      id: "u2", 
      name: "John Doe", 
      email: "john@klarone.com", 
      role: "Inventory Manager", 
      status: "Active", 
      lastLogin: "1 hour ago" 
    },
    { 
      id: "u3", 
      name: "Jane Smith", 
      email: "jane@klarone.com", 
      role: "Sales Executive", 
      status: "Pending Invitation", 
      lastLogin: "Never" 
    },
    { 
      id: "u4", 
      name: "Mike Johnson", 
      email: "mike@klarone.com", 
      role: "Support", 
      status: "Suspended", 
      lastLogin: "3 days ago" 
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active": return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case "Pending Invitation": return <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">Pending</Badge>;
      case "Suspended": return <Badge variant="destructive">Suspended</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-sm text-slate-500">Manage system users, invitations, and access.</p>
        </div>
        <Button className="bg-black text-white hover:bg-slate-800">
          <Plus className="w-4 h-4 mr-2" />
          Invite User
        </Button>
      </div>

      <Card>
        <div className="p-4 border-b flex gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input 
              placeholder="Search users by name or email..." 
              className="pl-9 bg-slate-50 border-transparent focus-visible:bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
                <tr>
                  <th className="px-6 py-4 font-medium">User</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Last Login</th>
                  <th className="px-6 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b last:border-0 hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{user.name}</div>
                          <div className="text-slate-500 text-xs">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Shield className="w-3.5 h-3.5 text-slate-400" />
                        {user.role}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {user.lastLogin}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}>
                          <MoreVertical className="w-4 h-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>User Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Edit2 className="w-4 h-4 mr-2" /> Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Shield className="w-4 h-4 mr-2" /> Change Role
                          </DropdownMenuItem>
                          {user.status === "Pending Invitation" && (
                            <DropdownMenuItem>
                              <Mail className="w-4 h-4 mr-2" /> Resend Invite
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <LogOut className="w-4 h-4 mr-2" /> Force Logout
                          </DropdownMenuItem>
                          {user.status === "Active" ? (
                            <DropdownMenuItem className="text-amber-600 focus:text-amber-600 focus:bg-amber-50">
                              <Ban className="w-4 h-4 mr-2" /> Suspend User
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem className="text-green-600 focus:text-green-600 focus:bg-green-50">
                              <Ban className="w-4 h-4 mr-2" /> Activate User
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50">
                            <Trash2 className="w-4 h-4 mr-2" /> Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
