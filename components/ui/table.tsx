
import * as React from "react"

const Table = ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
  <table className={`w-full caption-bottom text-sm ${className||''}`} {...props} />
)
const TableHeader = (props: React.HTMLAttributes<HTMLTableSectionElement>) => <thead {...props} />
const TableBody = (props: React.HTMLAttributes<HTMLTableSectionElement>) => <tbody {...props} />
const TableFooter = (props: React.HTMLAttributes<HTMLTableSectionElement>) => <tfoot {...props} />
const TableRow = (props: React.HTMLAttributes<HTMLTableRowElement>) => <tr {...props} />
const TableHead = (props: React.ThHTMLAttributes<HTMLTableCellElement>) => <th className="h-10 px-2 text-left align-middle font-medium" {...props} />
const TableCell = (props: React.TdHTMLAttributes<HTMLTableCellElement>) => <td className="p-2 align-middle" {...props} />

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell }
