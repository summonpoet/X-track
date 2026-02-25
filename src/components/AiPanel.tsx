import { X, Loader2, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import Markdown from 'react-markdown';

interface AiPanelProps {
  title: string;
  content: string | null;
  loading: boolean;
  error: string | null;
  onClose: () => void;
}

export default function AiPanel({ title, content, loading, error, onClose }: AiPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (content) {
      navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex justify-end">
      <div className="w-full max-w-2xl bg-gray-950 border-l border-gray-800 h-full flex flex-col animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <div className="flex items-center gap-2">
            {content && (
              <button
                onClick={handleCopy}
                className="p-2 rounded-full hover:bg-gray-900 text-gray-400 hover:text-white transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-900 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading && (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
              <p className="text-gray-400 text-sm">AI is thinking...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-950/30 border border-red-800 rounded-xl p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {content && (
            <div className="prose prose-invert prose-sm max-w-none
              prose-headings:text-white prose-headings:font-bold
              prose-p:text-gray-300 prose-p:leading-relaxed
              prose-strong:text-white
              prose-li:text-gray-300
              prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
              prose-code:text-blue-300 prose-code:bg-gray-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
              prose-blockquote:border-blue-500 prose-blockquote:text-gray-400
            ">
              <Markdown>{content}</Markdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
