import cn from "@lib/cn";
import { AllHTMLAttributes, HTMLAttributes, PropsWithChildren } from "react";

function Table({
  children,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLTableElement>>) {
  return (
    <table
      {...props}
      className={cn("w-full caption-bottom text-sm", props.className)}
    >
      {children}
    </table>
  );
}

export function TableHeader({
  children,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLTableSectionElement>>) {
  return (
    <thead
      {...props}
      className={cn(
        "[&_tr]:border-b font-rockingsoda text-lg",
        props.className
      )}
    >
      {children}
    </thead>
  );
}

export function TableHead({
  children,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLTableCellElement>>) {
  return (
    <th
      {...props}
      className={cn(
        "h-12 px-4 text-left align-middle [&:has([role=checkbox])]:pr-0",
        props.className
      )}
    >
      {children}
    </th>
  );
}

export function TableBody({
  children,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLTableSectionElement>>) {
  return (
    <tbody
      {...props}
      className={cn("[&_tr:last-child]:border-0", props.className)}
    >
      {children}
    </tbody>
  );
}

export function TableRow({
  children,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLTableRowElement>>) {
  return (
    <tr
      {...props}
      className={cn(
        "border-b transition-colors hover:bg-elevated/50 data-[state=selected]:bg-elevated",
        props.className
      )}
    >
      {children}
    </tr>
  );
}

export function TableCell({
  children,
  ...props
}: PropsWithChildren<AllHTMLAttributes<HTMLTableCellElement>>) {
  return (
    <td
      {...props}
      className={cn(
        "p-4 align-middle [&:has([role=checkbox])]:pr-0",
        props.className
      )}
    >
      {children}
    </td>
  );
}

export default Table;
