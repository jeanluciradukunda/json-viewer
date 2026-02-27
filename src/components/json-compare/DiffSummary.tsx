import type { DiffSummary as DiffSummaryType } from '@/types/diff';
import Badge from '@/components/ui/Badge';

interface DiffSummaryProps {
  summary: DiffSummaryType;
}

const DiffSummary = ({ summary }: DiffSummaryProps) => {
  return (
    <div className="flex flex-row gap-2 items-center px-1 py-1.5">
      <span className="text-xs font-serif text-text-secondary mr-1">Changes:</span>
      <Badge variant="success">● {summary.added} added</Badge>
      <Badge variant="warning">● {summary.modified} modified</Badge>
      <Badge variant="danger">● {summary.removed} removed</Badge>
    </div>
  );
};

export default DiffSummary;
