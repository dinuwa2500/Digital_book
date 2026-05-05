import React, { useState, useEffect, useRef } from 'react';
import { Bookmark, Save, List } from 'lucide-react';
import api from '../../services/api';

interface PageEditorProps {
  page: any;
  onSave: (content: string, date: string, fontColor: string) => void;
}

const LINE_HEIGHT = 32; // px — must match CSS background-size and BookViewer.tsx

const PageEditor: React.FC<PageEditorProps> = ({ page, onSave }) => {
  const [content, setContent] = useState(page.content || '');
  const [date, setDate] = useState(page.date || '');
  const [fontColor, setFontColor] = useState(page.fontColor || '#111111');
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(page.isBookmarked || false);
  
  // Track original state to prevent unnecessary saves
  const [originalState, setOriginalState] = useState({
    content: page.content || '',
    date: page.date || '',
    fontColor: page.fontColor || '#111111'
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Reset when navigating to a different page
  useEffect(() => {
    setContent(page.content || '');
    setDate(page.date || '');
    setFontColor(page.fontColor || '#111111');
    setIsBookmarked(page.isBookmarked || false);
    setIsDirty(false);
    setSavedFeedback(false);
    setOriginalState({
      content: page.content || '',
      date: page.date || '',
      fontColor: page.fontColor || '#111111'
    });
  }, [page._id]);

  // Auto-save: 8 seconds after last keystroke
  useEffect(() => {
    if (!isDirty) return;
    const timer = setTimeout(() => handleSave(), 8000);
    return () => clearTimeout(timer);
  }, [content, date, fontColor, isDirty]);

  const handleSave = async () => {
    if (!isDirty || saving) return;
    
    // Performance Fix: Only save if actually changed
    if (
      content === originalState.content &&
      date === originalState.date &&
      fontColor === originalState.fontColor
    ) {
      setIsDirty(false);
      return;
    }

    setSaving(true);
    try {
      await onSave(content, date, fontColor);
      setOriginalState({ content, date, fontColor });
      setIsDirty(false);
      setSavedFeedback(true);
      setTimeout(() => setSavedFeedback(false), 2000);
    } catch (err) {
      console.error('Save failed', err);
    } finally {
      setTimeout(() => setSaving(false), 600);
    }
  };

  const toggleBookmark = async () => {
    try {
      const res = await api.patch(`/pages/${page._id}/bookmark`);
      setIsBookmarked(res.data.isBookmarked);
    } catch (err) {
      console.error('Bookmark toggle failed', err);
    }
  };

  // ── Bullet Point Logic ──────────────────────────────────────────
  // Adds "• " to the beginning of each selected line.
  // If no selection, adds bullet to the current line only.
  const addBulletPoints = () => {
    const ta = textareaRef.current;
    if (!ta) return;

    const { selectionStart, selectionEnd } = ta;
    const lines = content.split('\n');

    // Find which line numbers the selection spans
    let charCount = 0;
    let startLine = 0;
    let endLine = 0;

    for (let i = 0; i < lines.length; i++) {
      const lineLen = lines[i].length + 1; // +1 for '\n'
      if (charCount + lineLen > selectionStart && startLine === 0 && i > 0) startLine = i;
      if (charCount <= selectionStart) startLine = i;
      if (charCount + lineLen > selectionEnd) { endLine = i; break; }
      if (i === lines.length - 1) endLine = i;
      charCount += lineLen;
    }

    // Toggle: if all selected lines already start with "• ", remove them; else add
    const selectedLines = lines.slice(startLine, endLine + 1);
    const allBulleted = selectedLines.every(l => l.startsWith('• '));

    const newLines = lines.map((line, idx) => {
      if (idx < startLine || idx > endLine) return line;
      if (allBulleted) {
        return line.startsWith('• ') ? line.slice(2) : line;
      } else {
        return line.startsWith('• ') ? line : '• ' + line;
      }
    });

    const newContent = newLines.join('\n');
    setContent(newContent);
    setIsDirty(true);

    // Restore focus and a reasonable cursor position
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(selectionStart, selectionStart);
    });
  };

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">

      {/* ── Header: Date / Title / Controls ── */}
      <div
        className="shrink-0 flex items-center gap-2 px-2 border-b-2 border-red-200/50 bg-transparent"
        style={{ height: LINE_HEIGHT }}
      >
        {/* Bookmark toggle */}
        <button
          onClick={toggleBookmark}
          title={isBookmarked ? 'Remove bookmark' : 'Bookmark page'}
          className={`shrink-0 transition-colors ${
            isBookmarked ? 'text-red-500' : 'text-stone-300 hover:text-stone-500'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
        </button>

        {/* ── Bullet Point button ── */}
        <button
          onMouseDown={e => {
            // prevent textarea from losing focus before we read selection
            e.preventDefault();
            addBulletPoints();
          }}
          title="Add bullet point to selected line(s)"
          className="shrink-0 flex items-center gap-1 text-stone-400 hover:text-stone-700 border border-stone-200 hover:border-stone-400 rounded px-1.5 py-0.5 transition-colors"
          style={{ fontSize: 11 }}
        >
          <List className="w-3 h-3" />
          <span className="font-serif" style={{ fontSize: 10, letterSpacing: '0.05em' }}>
            Bullet
          </span>
        </button>

        {/* Divider */}
        <span className="text-stone-200 shrink-0 text-xs">|</span>

        {/* ── Font Color picker ── */}
        <div className="flex items-center gap-1.5 shrink-0">
          <input 
            type="color"
            value={fontColor}
            onChange={(e) => { setFontColor(e.target.value); setIsDirty(true); }}
            className="w-4 h-4 rounded-full border-none cursor-pointer bg-transparent"
            title="Change font color"
          />
        </div>

        {/* Divider */}
        <span className="text-stone-200 shrink-0 text-xs">|</span>

        {/* Date — user types any format */}
        <input
          type="text"
          value={date}
          onChange={e => { setDate(e.target.value); setIsDirty(true); }}
          onBlur={handleSave}
          placeholder="Date"
          className="bg-transparent outline-none border-none font-serif italic text-stone-500 text-sm w-24 shrink-0 placeholder:text-stone-300"
        />

        <span className="text-stone-200 shrink-0 text-xs">|</span>

        {/* Page title */}
        <span className="font-serif italic text-stone-400 text-sm truncate flex-1 min-w-0">
          {page.title || 'Untitled'}
        </span>

        {/* Save indicator */}
        <div className="shrink-0 flex items-center gap-1.5">
          {saving && (
            <span className="text-[10px] uppercase tracking-widest text-indigo-400 animate-pulse">
              Saving…
            </span>
          )}
          {savedFeedback && !saving && (
            <span className="text-[10px] uppercase tracking-widest text-emerald-500">
              ✓ Saved
            </span>
          )}
          {isDirty && !saving && !savedFeedback && (
            <button
              onClick={handleSave}
              title="Save now"
              className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-indigo-500 hover:text-indigo-700 transition-colors"
            >
              <Save className="w-3 h-3" /> Save
            </button>
          )}
        </div>
      </div>

      {/* ── Writing area: paper-texture applied here so lines start at y=0 ── */}
      <div
        className="flex-1 relative overflow-hidden paper-texture"
        style={{ minHeight: 0 }}
      >
        <textarea
          ref={textareaRef}
          value={content}
          onChange={e => { setContent(e.target.value); setIsDirty(true); }}
          onBlur={handleSave}
          placeholder="Start writing…"
          spellCheck={false}
          style={{
            lineHeight: `${LINE_HEIGHT}px`,
            fontSize: '1.05rem',
            fontFamily: '"Georgia", "Times New Roman", serif',
            color: fontColor,
            caretColor: fontColor,
            paddingTop: 5,              // nudges baseline just above the rule
            paddingLeft: 64,            // indent past the red margin line (at 55px)
            paddingRight: 12,
            paddingBottom: 0,
            boxSizing: 'border-box',
          }}
          className="absolute inset-0 w-full h-full bg-transparent resize-none outline-none placeholder:text-stone-300/50"
        />
      </div>

      {/* ── Footer ── */}
      <div
        className="shrink-0 flex justify-between items-center px-3 text-[9px] uppercase tracking-widest text-stone-300 italic border-t border-stone-100"
        style={{ height: 22 }}
      >
        <span>{content.length} chars</span>
        <span>
          {page.lastSavedAt
            ? new Date(page.lastSavedAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })
            : '—'}
        </span>
      </div>
    </div>
  );
};

export default PageEditor;
