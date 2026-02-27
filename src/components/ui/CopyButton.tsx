import React from 'react';
import { useClipboard } from '@/hooks/useClipboard';
import Button from '@/components/ui/Button';

interface CopyButtonProps {
  text: string;
  label?: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ text, label }) => {
  const { copy, copied } = useClipboard();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => copy(text)}
      className="text-xs"
    >
      {copied ? '✓' : label ?? '⎘'}
    </Button>
  );
};

export default CopyButton;
