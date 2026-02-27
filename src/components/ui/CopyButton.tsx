import { useClipboard } from '@/hooks/useClipboard';

interface CopyButtonProps {
  text: string;
  label?: string;
}

const CopyButton = ({ text, label }: CopyButtonProps) => {
  const { copy, copied } = useClipboard();

  return (
    <button
      onClick={(e) => { e.stopPropagation(); copy(text); }}
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-btn text-xs font-mono
        bg-surface/80 hover:bg-terra-light text-text-secondary hover:text-terra
        transition-colors cursor-pointer border border-transparent hover:border-terra/20"
      title={label ? `Copy ${label}` : 'Copy'}
    >
      {copied ? (
        <span className="text-diff-added-text">✓</span>
      ) : (
        <>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="5" width="9" height="9" rx="1.5" />
            <path d="M2 11V2.5A.5.5 0 0 1 2.5 2H11" />
          </svg>
          {label && <span>{label}</span>}
        </>
      )}
    </button>
  );
};

export default CopyButton;
