"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
  Package,
  ShoppingCart,
  BookOpen,
  PlusCircle,
  FileText
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

interface GlobalSearchProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function GlobalSearch({ open, setOpen }: GlobalSearchProps) {
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open: boolean) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen]);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, [setOpen]);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search products, orders, customers..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Quick Actions">
          <CommandItem onSelect={() => runCommand(() => router.push("/admin/product/new"))}>
            <PlusCircle className="mr-2 h-4 w-4" />
            <span>Add New Product</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/admin/customer/new"))}>
            <User className="mr-2 h-4 w-4" />
            <span>Add New Customer</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/admin/order/new"))}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            <span>Create Order</span>
          </CommandItem>
        </CommandGroup>
        
        <CommandSeparator />
        
        <CommandGroup heading="Catalog">
          <CommandItem onSelect={() => runCommand(() => router.push("/admin/product"))}>
            <Package className="mr-2 h-4 w-4" />
            <span>All Products</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/admin/categories"))}>
            <FileText className="mr-2 h-4 w-4" />
            <span>Categories</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/admin/brands"))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Brands</span>
          </CommandItem>
        </CommandGroup>
        
        <CommandSeparator />
        
        <CommandGroup heading="Knowledge Catalog">
          <CommandItem onSelect={() => runCommand(() => router.push("/admin/knowledge-catalog"))}>
            <BookOpen className="mr-2 h-4 w-4" />
            <span>Knowledge Catalog</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/admin/knowledge-catalog/import"))}>
            <PlusCircle className="mr-2 h-4 w-4" />
            <span>Import Data</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />
        
        <CommandGroup heading="System">
          <CommandItem onSelect={() => runCommand(() => router.push("/admin/settings"))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/admin/users"))}>
            <User className="mr-2 h-4 w-4" />
            <span>Team Members</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
