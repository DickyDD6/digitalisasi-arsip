import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { flexRender, Row } from "@tanstack/react-table";
import { DeleteArchiveModal } from "./delete-archive-modal";
import { DownloadArchiveModal } from "./download-archive-modal";
import { ViewArchiveModal } from "./view-archive-modal";

export const ContextMenuArchive = ({ row }: { row: Row<ArchiveDocument> }) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger
        render={(triggerProps) => (
          <TableRow
            {...triggerProps}
            data-state={row.getIsSelected() ? "selected" : undefined}
          >
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id} align="center">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        )}
      />
      <ContextMenuContent className="grid gap-2">
        <ContextMenuItem>
          <ViewArchiveModal id={row.original.id} />
        </ContextMenuItem>
        <ContextMenuItem>
          <DownloadArchiveModal id={row.original.id} />
        </ContextMenuItem>
        <ContextMenuItem>
          <DeleteArchiveModal id={row.original.id} />
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
