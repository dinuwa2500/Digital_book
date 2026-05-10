import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PageEditor from './PageEditor';

interface BookViewerProps {
  leftPage: any;
  rightPage: any;
  onNext: () => void;
  onPrev: () => void;
  onSave?: (pageId: string, content: string, date: string, fontColor: string, images: any[], tables: any[]) => void;
  pageCount?: number; 
  readOnly?: boolean;
  leftRef?: React.RefObject<any>;
  rightRef?: React.RefObject<any>;
  onPageFocus?: (side: 'left' | 'right') => void;
}

const LINE_HEIGHT = 32;

const BookViewer: React.FC<BookViewerProps> = ({ 
  leftPage, 
  rightPage, 
  onNext, 
  onPrev, 
  onSave,
  pageCount = 80,
  readOnly = false,
  leftRef,
  rightRef,
  onPageFocus
}) => {
  const bookHeightPx = (pageCount + 2) * LINE_HEIGHT;
  const clampedHeight = Math.min(bookHeightPx, window.innerHeight * 0.88);

  return (
    <div className="book-viewer-wrapper relative w-full max-w-6xl mx-auto flex items-center justify-center p-2 sm:p-4 md:p-8 overflow-hidden">
      {/* Outer cover */}
      <div
        className="relative w-full bg-[#292524] dark:bg-[#1a1a1a] rounded-lg book-container flex p-1 sm:p-2 overflow-hidden shadow-2xl transition-all duration-500"
        style={{ height: clampedHeight }}
      >
        
        <AnimatePresence mode="wait">
          {/* Left Page — always shown */}
          <motion.div 
            key={leftPage?._id || 'empty-left'}
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="book-left-page w-full sm:w-1/2 h-full rounded-md sm:rounded-l-md sm:rounded-r-none overflow-hidden page-curve-left flex flex-col"
            style={{ backgroundColor: 'var(--book-bg)' }}
          >
            {/* Gutter shadow overlay */}
            <div className="hidden sm:block absolute inset-y-0 right-0 w-16 left-page-gutter z-10 pointer-events-none" />

            {leftPage ? (
              <div className="flex-1 overflow-hidden h-full relative z-20 flex flex-col px-1.5 sm:px-3 pt-2 pb-1">
                <PageEditor
                  ref={leftRef}
                  page={leftPage}
                  onSave={(content, date, fontColor, images, tables) => onSave?.(leftPage._id, content, date, fontColor, images, tables)}
                  readOnly={readOnly}
                  onFocus={() => onPageFocus?.('left')}
                />
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-stone-200 dark:text-stone-800 italic font-serif">
                Inner Cover
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Central Spine Binding — hidden on mobile */}
        <div className="book-spine hidden sm:block w-[4px] h-full bg-black/40 relative z-30 shrink-0" />

        <AnimatePresence mode="wait">
          {/* Right Page — hidden on mobile via CSS */}
          <motion.div 
            key={rightPage?._id || 'empty-right'}
            initial={{ rotateY: -90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: 90, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="book-right-page hidden sm:flex w-1/2 h-full rounded-r-md overflow-hidden page-curve-right flex-col"
            style={{ backgroundColor: 'var(--book-bg)' }}
          >
            {/* Gutter shadow overlay */}
            <div className="absolute inset-y-0 left-0 w-16 right-page-gutter z-10 pointer-events-none" />

            {rightPage ? (
              <div className="flex-1 overflow-hidden h-full relative z-20 flex flex-col px-3 pt-2 pb-1">
                <PageEditor
                  ref={rightRef}
                  page={rightPage}
                  onSave={(content, date, fontColor, images, tables) => onSave?.(rightPage._id, content, date, fontColor, images, tables)}
                  readOnly={readOnly}
                  onFocus={() => onPageFocus?.('right')}
                />
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-stone-200 dark:text-stone-800 italic font-serif">
                The End
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls — moved outside book on mobile */}
        <button 
          onClick={onPrev}
          className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 bg-white/80 rounded-full hover:bg-white shadow-lg transition-all z-20"
          aria-label="Previous pages"
        >
          <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-gray-700" />
        </button>
        
        <button 
          onClick={onNext}
          className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 bg-white/80 rounded-full hover:bg-white shadow-lg transition-all z-20"
          aria-label="Next pages"
        >
          <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-gray-700" />
        </button>
      </div>
    </div>
  );
};

export default BookViewer;
