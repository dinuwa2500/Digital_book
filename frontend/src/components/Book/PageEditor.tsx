import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { createPortal } from "react-dom";
import {
  Bookmark,
  Save,
  Table as TableIcon,
  Plus,
  Trash2,
} from "lucide-react";
import api from "../../services/api";
import DrawingCanvas from "./DrawingCanvas";

interface PageEditorProps {
  page: any;
  onSave?: (
    content: string,
    date: string,
    fontColor: string,
    images: any[],
    tables: any[],
  ) => void;
  readOnly?: boolean;
  onFocus?: () => void;
}

const LINE_HEIGHT = 32; // px — must match CSS background-size and BookViewer.tsx

const PageEditor = forwardRef<any, PageEditorProps>((props, ref) => {
  const { page, onSave, readOnly = false, onFocus } = props;
  const [content, setContent] = useState(page.content || "");
  const [date, setDate] = useState(page.date || "");
  const [fontColor, setFontColor] = useState(page.fontColor || "#111111");
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(page.isBookmarked || false);
  const [images, setImages] = useState<any[]>(page.images || []);
  const [tables, setTables] = useState<any[]>(page.tables || []);
  const [isDrawing, setIsDrawing] = useState(false);

  // Track original state to prevent unnecessary saves
  const [originalState, setOriginalState] = useState({
    content: page.content || "",
    date: page.date || "",
    fontColor: page.fontColor || "#111111",
    images: page.images || [],
    tables: page.tables || [],
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useImperativeHandle(ref, () => ({
    addBulletPoints,
    centerLines,
    addTable,
    openPen: () => setIsDrawing(true),
  }));

  // Reset when navigating to a different page
  useEffect(() => {
    setContent(page.content || "");
    setDate(page.date || "");
    setFontColor(page.fontColor || "#111111");
    setIsBookmarked(page.isBookmarked || false);
    setImages(page.images || []);
    setTables(page.tables || []);
    setIsDirty(false);
    setSavedFeedback(false);
    setOriginalState({
      content: page.content || "",
      date: page.date || "",
      fontColor: page.fontColor || "#111111",
      images: page.images || [],
      tables: page.tables || [],
    });
  }, [page._id]);

  // Auto-save: 8 seconds after last keystroke
  useEffect(() => {
    if (!isDirty) return;
    const timer = setTimeout(() => handleSave(), 8000);
    return () => clearTimeout(timer);
  }, [content, date, fontColor, images, tables, isDirty]);

  const handleSave = async () => {
    if (!isDirty || saving) return;

    // Performance Fix: Only save if actually changed
    if (
      content === originalState.content &&
      date === originalState.date &&
      fontColor === originalState.fontColor &&
      JSON.stringify(images) === JSON.stringify(originalState.images) &&
      JSON.stringify(tables) === JSON.stringify(originalState.tables)
    ) {
      setIsDirty(false);
      return;
    }

    setSaving(true);
    try {
      await onSave(content, date, fontColor, images, tables);
      setOriginalState({ content, date, fontColor, images, tables });
      setIsDirty(false);
      setSavedFeedback(true);
      setTimeout(() => setSavedFeedback(false), 2000);
    } catch (err) {
      console.error("Save failed", err);
    } finally {
      setTimeout(() => setSaving(false), 600);
    }
  };

  const toggleBookmark = async () => {
    try {
      const res = await api.patch(`/pages/${page._id}/bookmark`);
      setIsBookmarked(res.data.isBookmarked);
    } catch (err) {
      console.error("Bookmark toggle failed", err);
    }
  };

  // ── Bullet Point Logic ──────────────────────────────────────────
  // Adds "• " to the beginning of each selected line.
  // If no selection, adds bullet to the current line only.
  const addBulletPoints = () => {
    const ta = textareaRef.current;
    if (!ta) return;

    const { selectionStart, selectionEnd } = ta;
    const lines = content.split("\n");

    // Find which line numbers the selection spans
    let charCount = 0;
    let startLine = 0;
    let endLine = 0;

    for (let i = 0; i < lines.length; i++) {
      const lineLen = lines[i].length + 1; // +1 for '\n'
      if (charCount + lineLen > selectionStart && startLine === 0 && i > 0)
        startLine = i;
      if (charCount <= selectionStart) startLine = i;
      if (charCount + lineLen > selectionEnd) {
        endLine = i;
        break;
      }
      if (i === lines.length - 1) endLine = i;
      charCount += lineLen;
    }

    // Toggle: if all selected lines already start with "• ", remove them; else add
    const selectedLines = lines.slice(startLine, endLine + 1);
    const allBulleted = selectedLines.every((l) => l.startsWith("• "));

    const newLines = lines.map((line, idx) => {
      if (idx < startLine || idx > endLine) return line;
      if (allBulleted) {
        return line.startsWith("• ") ? line.slice(2) : line;
      } else {
        return line.startsWith("• ") ? line : "• " + line;
      }
    });

    const newContent = newLines.join("\n");
    setContent(newContent);
    setIsDirty(true);

    // Restore focus and a reasonable cursor position
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(selectionStart, selectionStart);
    });
  };

  // ── Center Text Logic ──────────────────────────────────────────
  // Pads the current line(s) with spaces to appear centered.
  const centerLines = () => {
    const ta = textareaRef.current;
    if (!ta) return;

    const { selectionStart, selectionEnd } = ta;
    const lines = content.split("\n");

    // Find which line numbers the selection spans
    let charCount = 0;
    let startLine = 0;
    let endLine = 0;

    for (let i = 0; i < lines.length; i++) {
      const lineLen = lines[i].length + 1; // +1 for '\n'
      if (charCount <= selectionStart) startLine = i;
      if (charCount + lineLen > selectionEnd) {
        endLine = i;
        break;
      }
      if (i === lines.length - 1) endLine = i;
      charCount += lineLen;
    }

    // Measure and center each line in selection
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return;

    const style = window.getComputedStyle(ta);
    context.font = `${style.fontSize} ${style.fontFamily}`;

    const spaceWidth = context.measureText(" ").width;
    const taWidth = ta.clientWidth - 64 - 12; // paddingLeft: 64, paddingRight: 12

    const newLines = lines.map((line, idx) => {
      if (idx < startLine || idx > endLine) return line;

      const trimmedLine = line.trim();
      if (!trimmedLine) return "";

      const textWidth = context.measureText(trimmedLine).width;
      const availableSpace = taWidth - textWidth;

      if (availableSpace <= 0) return trimmedLine;

      const spacesNeeded = Math.floor(availableSpace / 2 / spaceWidth);
      return " ".repeat(spacesNeeded) + trimmedLine;
    });

    const newContent = newLines.join("\n");
    setContent(newContent);
    setIsDirty(true);

    requestAnimationFrame(() => {
      ta.focus();
      // Keep selection or just move to start?
      // For now, let's just keep the focus.
      ta.setSelectionRange(selectionStart, selectionStart);
    });
  };

  // ── Paste Logic for Images ──────────────────────────────────────
  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        if (!file) continue;

        const reader = new FileReader();
        reader.onload = (event) => {
          const newImage = {
            id: Date.now().toString() + Math.random().toString(36).substring(7),
            src: event.target?.result as string,
            x: 50,
            y: 50,
            width: 250,
            height: 250,
          };
          setImages((prev) => {
            const updated = [...prev, newImage];
            setIsDirty(true);
            return updated;
          });
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // ── Click to Type on Empty Lines ────────────────────────────────
  const handleEditorClick = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    const ta = e.currentTarget;
    const rect = ta.getBoundingClientRect();
    const clickY = e.clientY - rect.top + ta.scrollTop;

    const paddingTop = 5; // Matches the textarea style.paddingTop
    const targetLineIndex = Math.floor((clickY - paddingTop) / LINE_HEIGHT);

    const lines = content.split("\n");

    // If clicked below the current text, add newlines to reach that line
    if (targetLineIndex >= lines.length) {
      const newlinesToAdd = targetLineIndex - lines.length + 1;
      const paddedContent = content + "\n".repeat(newlinesToAdd);

      setContent(paddedContent);
      setIsDirty(true);

      // Move cursor to the end
      requestAnimationFrame(() => {
        ta.focus();
        ta.setSelectionRange(paddedContent.length, paddedContent.length);
      });
    }
  };

  // ── Table Logic ────────────────────────────────────────────────
  const addTable = () => {
    const newTable = {
      id: Date.now().toString() + Math.random().toString(36).substring(7),
      x: 64, // Start after the margin
      y: 100,
      width: 400,
      height: 100,
      rows: 2,
      cols: 2,
      data: [
        ["", ""],
        ["", ""],
      ], // Initial 2x2 empty table
    };
    setTables((prev) => {
      const updated = [...prev, newTable];
      setIsDirty(true);
      return updated;
    });
  };

  const updateTableCell = (
    tableId: string,
    rowIndex: number,
    colIndex: number,
    value: string,
  ) => {
    setTables((prev) => {
      const updated = prev.map((t) => {
        if (t.id === tableId) {
          const newData = [...t.data];
          newData[rowIndex] = [...newData[rowIndex]];
          newData[rowIndex][colIndex] = value;
          return { ...t, data: newData };
        }
        return t;
      });
      setIsDirty(true);
      return updated;
    });
  };

  const deleteTable = (tableId: string) => {
    setTables((prev) => {
      const updated = prev.filter((t) => t.id !== tableId);
      setIsDirty(true);
      return updated;
    });
  };

  const addRow = (tableId: string) => {
    setTables((prev) => {
      const updated = prev.map((t) => {
        if (t.id === tableId) {
          const newRow = Array(t.cols).fill("");
          return { ...t, rows: t.rows + 1, data: [...t.data, newRow] };
        }
        return t;
      });
      setIsDirty(true);
      return updated;
    });
  };

  const addCol = (tableId: string) => {
    setTables((prev) => {
      const updated = prev.map((t) => {
        if (t.id === tableId) {
          const newData = t.data.map((row: string[]) => [...row, ""]);
          return { ...t, cols: t.cols + 1, data: newData };
        }
        return t;
      });
      setIsDirty(true);
      return updated;
    });
  };

  return (
    <div className='h-full w-full flex flex-col overflow-hidden'>
      {/* ── Header: Date / Title / Controls ── */}
      <div
        className='shrink-0 flex items-center gap-2 px-2 border-b-2 border-red-200/50 bg-transparent'
        style={{ height: LINE_HEIGHT }}
      >
        {/* Bookmark toggle */}
        <button
          onClick={readOnly ? undefined : toggleBookmark}
          disabled={readOnly}
          title={isBookmarked ? "Remove bookmark" : "Bookmark page"}
          className={`shrink-0 transition-colors ${
            isBookmarked
              ? "text-red-500"
              : "text-stone-300 hover:text-stone-500"
          } ${readOnly ? "cursor-default opacity-50" : ""}`}
        >
          <Bookmark
            className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`}
          />
        </button>

        {/* Divider */}
        <span className='text-stone-200 shrink-0 text-xs'>|</span>

        {/* ── Font Color picker ── */}
        {!readOnly && (
          <div className='flex items-center gap-1.5 shrink-0'>
            <input
              type='color'
              value={fontColor}
              onChange={(e) => {
                setFontColor(e.target.value);
                setIsDirty(true);
              }}
              className='w-4 h-4 rounded-full border-none cursor-pointer bg-transparent'
              title='Change font color'
            />
          </div>
        )}

        {/* Divider */}
        <span className='text-stone-200 shrink-0 text-xs'>|</span>

        {/* Date — user types any format */}
        <input
          type='text'
          value={date}
          onChange={(e) => {
            if (!readOnly) {
              setDate(e.target.value);
              setIsDirty(true);
            }
          }}
          onBlur={handleSave}
          readOnly={readOnly}
          placeholder='Date'
          className={`bg-transparent outline-none border-none font-serif italic text-stone-500 text-sm w-24 shrink-0 placeholder:text-stone-300 ${readOnly ? "cursor-default" : ""}`}
        />

        <span className='text-stone-200 shrink-0 text-xs'>|</span>

        {/* Page title */}
        <span className='font-serif italic text-stone-400 text-sm truncate flex-1 min-w-0'>
          {page.title || "Untitled"}
        </span>

        {/* Save indicator */}
        <div className='shrink-0 flex items-center gap-1.5'>
          {saving && (
            <span className='text-[10px] uppercase tracking-widest text-indigo-400 animate-pulse'>
              Saving…
            </span>
          )}
          {savedFeedback && !saving && (
            <span className='text-[10px] uppercase tracking-widest text-emerald-500'>
              ✓ Saved
            </span>
          )}
          {isDirty && !saving && !savedFeedback && (
            <button
              onClick={handleSave}
              title='Save now'
              className='flex items-center gap-1 text-[10px] uppercase tracking-widest text-indigo-500 hover:text-indigo-700 transition-colors'
            >
              <Save className='w-3 h-3' /> Save
            </button>
          )}
        </div>
      </div>

      {/* ── Writing area: paper-texture applied here so lines start at y=0 ── */}
      <div
        className='flex-1 relative overflow-hidden paper-texture'
        style={{ minHeight: 0 }}
      >
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => {
            if (!readOnly) {
              setContent(e.target.value);
              setIsDirty(true);
            }
          }}
          onBlur={handleSave}
          onPaste={readOnly ? undefined : handlePaste}
          onClick={readOnly ? undefined : handleEditorClick}
          onFocus={onFocus}
          readOnly={readOnly}
          placeholder={readOnly ? "" : "Start writing or paste an image…"}
          spellCheck={false}
          style={{
            lineHeight: `${LINE_HEIGHT}px`,
            fontSize: "1.05rem",
            fontFamily: '"Georgia", "Times New Roman", serif',
            color: fontColor,
            caretColor: readOnly ? "transparent" : fontColor,
            paddingTop: 5, // nudges baseline just above the rule
            paddingLeft: 64, // indent past the red margin line (at 55px)
            paddingRight: 12,
            paddingBottom: 0,
            boxSizing: "border-box",
            cursor: readOnly ? "default" : "text",
          }}
          className='absolute inset-0 w-full h-full bg-transparent resize-none outline-none placeholder:text-stone-300/50 z-0'
        />

        {/* ── Images Layer ── */}
        {images.map((img, idx) => (
          <div
            key={img.id}
            style={{
              position: "absolute",
              left: img.x || 50,
              top: img.y || 50,
              width: img.width || 250,
              height: img.height || 250,
              zIndex: 50,
            }}
            className={`group ${readOnly ? "cursor-default" : "cursor-move"}`}
            onPointerDown={(e) => {
              if (readOnly) return;
              // Simple drag implementation
              e.preventDefault();
              const startX = e.clientX;
              const startY = e.clientY;
              const originalX = img.x || 50;
              const originalY = img.y || 50;

              const onPointerMove = (moveEvent: PointerEvent) => {
                setImages((prev) => {
                  const next = [...prev];
                  next[idx] = {
                    ...next[idx],
                    x: originalX + (moveEvent.clientX - startX),
                    y: originalY + (moveEvent.clientY - startY),
                  };
                  return next;
                });
                setIsDirty(true);
              };

              const onPointerUp = () => {
                window.removeEventListener("pointermove", onPointerMove);
                window.removeEventListener("pointerup", onPointerUp);
                handleSave();
              };

              window.addEventListener("pointermove", onPointerMove);
              window.addEventListener("pointerup", onPointerUp);
            }}
          >
            <img
              src={img.src}
              alt='Pasted'
              className='w-full h-full object-cover rounded shadow-md pointer-events-none'
            />

            {/* Resize handle */}
            <div
              className='absolute bottom-0 right-0 w-6 h-6 cursor-se-resize opacity-0 group-hover:opacity-100 bg-indigo-500/80 rounded-tl-full shadow'
              onPointerDown={(e) => {
                e.stopPropagation(); // prevent drag
                const startX = e.clientX;
                const startY = e.clientY;
                const startWidth = img.width || 250;
                const startHeight = img.height || 250;

                const onPointerMove = (moveEvent: PointerEvent) => {
                  setImages((prev) => {
                    const next = [...prev];
                    next[idx] = {
                      ...next[idx],
                      width: Math.max(
                        50,
                        startWidth + (moveEvent.clientX - startX),
                      ),
                      height: Math.max(
                        50,
                        startHeight + (moveEvent.clientY - startY),
                      ),
                    };
                    return next;
                  });
                  setIsDirty(true);
                };

                const onPointerUp = () => {
                  window.removeEventListener("pointermove", onPointerMove);
                  window.removeEventListener("pointerup", onPointerUp);
                  handleSave(); // Optional immediate save on resize end
                };

                window.addEventListener("pointermove", onPointerMove);
                window.addEventListener("pointerup", onPointerUp);
              }}
            />

            {/* Delete button */}
            {!readOnly && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setImages((prev) => prev.filter((i) => i.id !== img.id));
                  setIsDirty(true);
                }}
                className='absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-md transition-opacity z-50 hover:bg-red-600'
              >
                ×
              </button>
            )}
          </div>
        ))}

        {/* ── Tables Layer ── */}
        {tables.map((table, tIdx) => (
          <div
            key={table.id}
            style={{
              position: "absolute",
              left: table.x || 64,
              top: table.y || 100,
              width: table.width || 400,
              zIndex: 60,
            }}
            className={`group bg-white/80 backdrop-blur-[2px] border border-stone-300 rounded shadow-sm ${readOnly ? "" : "hover:shadow-md transition-shadow"}`}
          >
            {/* Table Header/Controls */}
            {!readOnly && (
              <div className='flex items-center justify-between bg-stone-100 px-2 py-1 rounded-t border-b border-stone-200 opacity-0 group-hover:opacity-100 transition-opacity'>
                <div className='flex items-center gap-2'>
                  <div
                    className='cursor-move p-0.5 text-stone-400 hover:text-stone-600'
                    onPointerDown={(e) => {
                      e.preventDefault();
                      const startX = e.clientX;
                      const startY = e.clientY;
                      const originalX = table.x || 64;
                      const originalY = table.y || 100;

                      const onPointerMove = (moveEvent: PointerEvent) => {
                        setTables((prev) => {
                          const next = [...prev];
                          next[tIdx] = {
                            ...next[tIdx],
                            x: originalX + (moveEvent.clientX - startX),
                            y: originalY + (moveEvent.clientY - startY),
                          };
                          return next;
                        });
                        setIsDirty(true);
                      };

                      const onPointerUp = () => {
                        window.removeEventListener(
                          "pointermove",
                          onPointerMove,
                        );
                        window.removeEventListener("pointerup", onPointerUp);
                        handleSave();
                      };

                      window.addEventListener("pointermove", onPointerMove);
                      window.addEventListener("pointerup", onPointerUp);
                    }}
                  >
                    <div className='w-3 h-3 grid grid-cols-2 gap-0.5'>
                      <div className='bg-current rounded-full' />
                      <div className='bg-current rounded-full' />
                      <div className='bg-current rounded-full' />
                      <div className='bg-current rounded-full' />
                    </div>
                  </div>
                  <button
                    onClick={() => addRow(table.id)}
                    title='Add row'
                    className='p-0.5 text-stone-400 hover:text-emerald-600'
                  >
                    <Plus className='w-3 h-3' />
                  </button>
                  <button
                    onClick={() => addCol(table.id)}
                    title='Add column'
                    className='p-0.5 text-stone-400 hover:text-emerald-600'
                  >
                    <TableIcon className='w-3 h-3' />
                  </button>
                </div>
                <button
                  onClick={() => deleteTable(table.id)}
                  title='Delete table'
                  className='p-0.5 text-stone-400 hover:text-red-600'
                >
                  <Trash2 className='w-3 h-3' />
                </button>
              </div>
            )}

            <table className='w-full border-collapse'>
              <tbody>
                {table.data.map((row: string[], rIdx: number) => (
                  <tr key={rIdx}>
                    {row.map((cell: string, cIdx: number) => (
                      <td key={cIdx} className='border border-stone-300 p-0'>
                        <input
                          type='text'
                          value={cell}
                          onChange={(e) =>
                            updateTableCell(
                              table.id,
                              rIdx,
                              cIdx,
                              e.target.value,
                            )
                          }
                          onBlur={handleSave}
                          readOnly={readOnly}
                          className='w-full h-full bg-transparent outline-none px-2 py-1 text-sm font-serif min-h-[24px]'
                          style={{ color: fontColor }}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Resize handle */}
            {!readOnly && (
              <div
                className='absolute bottom-0 right-0 w-3 h-3 cursor-se-resize opacity-0 group-hover:opacity-100'
                onPointerDown={(e) => {
                  e.stopPropagation();
                  const startX = e.clientX;
                  const startWidth = table.width || 400;

                  const onPointerMove = (moveEvent: PointerEvent) => {
                    setTables((prev) => {
                      const next = [...prev];
                      next[tIdx] = {
                        ...next[tIdx],
                        width: Math.max(
                          100,
                          startWidth + (moveEvent.clientX - startX),
                        ),
                      };
                      return next;
                    });
                    setIsDirty(true);
                  };

                  const onPointerUp = () => {
                    window.removeEventListener("pointermove", onPointerMove);
                    window.removeEventListener("pointerup", onPointerUp);
                    handleSave();
                  };

                  window.addEventListener("pointermove", onPointerMove);
                  window.addEventListener("pointerup", onPointerUp);
                }}
              >
                <div className='absolute bottom-0 right-0 w-1.5 h-1.5 bg-stone-400 rounded-sm' />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Footer ── */}
      <div
        className='shrink-0 flex justify-between items-center px-3 text-[9px] uppercase tracking-widest text-stone-300 italic border-t border-stone-100'
        style={{ height: 22 }}
      >
        <span>
          {content.length} chars | {images.length} images
        </span>
        <span>
          {page.lastSavedAt
            ? new Date(page.lastSavedAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "—"}
        </span>
      </div>

      {/* ── Virtual Pen Overlay (Portal to Body) ── */}
      {isDrawing &&
        createPortal(
          <div className='fixed inset-0 z-[9999] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300'>
            <div className='w-full h-full max-w-6xl max-h-[90vh] bg-white rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col relative border border-white/20'>
              <DrawingCanvas
                initialColor={fontColor}
                onCancel={() => setIsDrawing(false)}
                onSave={(dataUrl) => {
                  const newImage = {
                    id:
                      Date.now().toString() +
                      Math.random().toString(36).substring(7),
                    src: dataUrl,
                    x: 100,
                    y: 100,
                    width: 500,
                    height: 400,
                  };
                  setImages((prev) => {
                    const updated = [...prev, newImage];
                    setIsDirty(true);
                    return updated;
                  });
                  setIsDrawing(false);
                }}
              />
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
});

export default PageEditor;
