import clsx from "clsx";
import { HTMLAttributes, PropsWithChildren } from "react";

function Table({
  children,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLTableElement>>) {
  return (
    <table
      {...props}
      className={clsx("w-full caption-bottom text-sm", props.className)}
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
    <thead {...props} className={clsx("[&_tr]:border-b", props.className)}>
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
      className={clsx(
        "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
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
      className={clsx("[&_tr:last-child]:border-0", props.className)}
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
      className={clsx(
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
}: PropsWithChildren<HTMLAttributes<HTMLTableCellElement>>) {
  return (
    <td
      {...props}
      className={clsx(
        "p-4 align-middle [&:has([role=checkbox])]:pr-0",
        props.className
      )}
    >
      {children}
    </td>
  );
}

export default Table;
