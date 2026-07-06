import { useEffect } from 'react';

function PdfViewerModal({ pdfUrl, onClose, onReupload }) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-5xl bg-white rounded-[2rem] shadow-glow flex flex-col max-h-[90vh] border border-white/70">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Document Viewer</p>
            <h2 className="mt-1 font-display text-2xl font-bold text-slate-950">PDF Preview</h2>
          </div>
          <div className="flex items-center gap-3">
            {onReupload && (
              <button
                onClick={onReupload}
                className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Reupload
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto min-h-[60vh] flex flex-col">
          {!pdfUrl ? (
            <div className="flex flex-1 items-center justify-center text-rose-600 bg-rose-50 rounded-2xl border border-rose-200">
              <p className="font-medium text-sm">Error: PDF URL is missing or invalid.</p>
            </div>
          ) : (
            <iframe 
              src={pdfUrl} 
              className="w-full h-full min-h-[60vh] rounded-2xl border border-slate-200 bg-slate-50"
              title="PDF Preview"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default PdfViewerModal;
