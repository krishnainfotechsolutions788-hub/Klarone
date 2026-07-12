"use client";

import { useState } from "react";
import { Plus, Search, MoreVertical, Edit2, Copy, Trash2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

export default function RolesManagementPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for UI demonstration
  const roles = [
    { id: 1, name: "Super Admin", users: 1, isSystem: true, description: "Full system access" },
    { id: 2, name: "Inventory Manager", users: 4, isSystem: false, description: "Manage products and inventory levels" },
    { id: 3, name: "Sales Executive", users: 12, isSystem: false, description: "View and process orders" },
  ];

  const permissions = [
    {
      module: "Products",
      items: [
        { id: "products.view", label: "View Products" },
        { id: "products.create", label: "Create Products" },
        { id: "products.edit", label: "Edit Products" },
        { id: "products.delete", label: "Delete Products" },
      ]
    },
    {
      module: "Inventory",
      items: [
        { id: "inventory.view", label: "View Inventory" },
        { id: "inventory.create", label: "Add Inventory" },
        { id: "inventory.edit", label: "Edit Inventory" },
      ]
    }
  ];

  if (isCreating) {
    return (
      <div className="p-6 space-y-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Create Role</h1>
            <p className="text-sm text-slate-500">Define a new role and its permissions.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
            <Button className="bg-black text-white hover:bg-slate-800">Save Role</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Role Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Role Name</label>
                  <Input placeholder="e.g. Marketing Manager" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Input placeholder="Brief description of responsibilities" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
                <div>
                  <CardTitle className="text-base">Permissions</CardTitle>
                  <CardDescription>Select the modules this role can access.</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Clear All</Button>
                  <Button variant="outline" size="sm">Select All</Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {permissions.map((group) => (
                  <div key={group.module} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Shield className="w-4 h-4 text-slate-500" />
                        {group.module}
                      </h4>
                      <div className="flex items-center gap-2">
                        <Checkbox id={`group-${group.module}`} />
                        <label htmlFor={`group-${group.module}`} className="text-xs text-slate-500 font-medium">
                          Select Module
                        </label>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {group.items.map((perm) => (
                        <div key={perm.id} className="flex items-center space-x-2 bg-slate-50 p-2 rounded">
                          <Checkbox id={perm.id} />
                          <label
                            htmlFor={perm.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {perm.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Roles & Permissions</h1>
          <p className="text-sm text-slate-500">Manage organizational roles and access control.</p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="bg-black text-white hover:bg-slate-800">
          <Plus className="w-4 h-4 mr-2" />
          Create Role
        </Button>
      </div>

      <div className="flex items-center gap-4 bg-white p-3 rounded-lg border shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input 
            placeholder="Search roles..." 
            className="pl-9 bg-slate-50 border-transparent focus-visible:bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <Card key={role.id} className="hover:border-slate-300 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {role.name}
                    {role.isSystem && (
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-50">System</Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="mt-1">{role.description}</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="-mt-1 -mr-2" />}>
                    <MoreVertical className="w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit2 className="w-4 h-4 mr-2" /> Edit Role
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="w-4 h-4 mr-2" /> Clone Role
                    </DropdownMenuItem>
                    {!role.isSystem && (
                      <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50">
                        <Trash2 className="w-4 h-4 mr-2" /> Delete Role
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm pt-4 border-t">
                <span className="text-slate-500">Active Users</span>
                <span className="font-semibold bg-slate-100 px-2 py-0.5 rounded-full">{role.users}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
