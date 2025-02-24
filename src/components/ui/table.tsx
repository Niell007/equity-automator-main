'use client'

import * as React from "react"
import { cn } from "@/lib/utils"

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, "aria-label": ariaLabel, ...props }, ref) => (
  <div className="relative w-full overflow-auto rounded-lg shadow-sm">
    <table
      ref={ref}
      role="grid"
      aria-label={ariaLabel}
      className={cn("w-full caption-bottom text-sm bg-white dark:bg-gray-800", className)}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead 
    ref={ref} 
    role="rowgroup"
    className={cn("[&_tr]:border-b bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur supports-[backdrop-filter]:bg-gray-50/50", className)} 
    {...props} 
  />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    role="rowgroup"
    className={cn("[&_tr:last-child]:border-0 [&_tr:hover]:bg-gray-50 dark:bg-gray-800 dark:[&_tr:hover]:bg-gray-700/50", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn("bg-gray-50 dark:bg-gray-800 font-medium text-gray-900 dark:text-gray-50 border-t", className)}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-all duration-200 hover:bg-gray-50/80 dark:hover:bg-gray-700/50 data-[state=selected]:bg-gray-100 dark:data-[state=selected]:bg-gray-800 group",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-gray-500 dark:text-gray-400 [&:has([role=checkbox])]:pr-0",
      "hover:text-gray-900 dark:hover:text-gray-200 transition-colors cursor-pointer select-none",
      "[&[data-sort=asc]]:after:content-['↑'] [&[data-sort=desc]]:after:content-['↓']",
      "[&[data-sort]]:after:ml-2 [&[data-sort]]:after:text-blue-500",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "p-4 align-middle [&:has([role=checkbox])]:pr-0",
      "group-hover:bg-gray-50/50 dark:group-hover:bg-gray-700/50 transition-colors duration-200",
      "first:font-medium first:text-gray-900 dark:first:text-gray-100",
      className
    )}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-gray-500 dark:text-gray-400", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
