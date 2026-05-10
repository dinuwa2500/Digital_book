import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import BookViewer from '../components/Book/BookViewer';
import {
  ChevronLeft, Plus, List, Moon, Sun, Loader2,
  BookOpen, FileText, ChevronRight, Share2, Globe, Lock,
  X, AlignCenter, Pencil, Table as TableIcon, Menu
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../utils/alerts';


const BookPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [chapters, setChapters] = useState<any[]>([]);
  const [pages, setPages] = useState<any[]>([]);
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [pageCount, setPageCount] = useState(80);
  const [book, setBook] = useState<any>(null);
  const { user } = useAuth();
  const [isOwner, setIsOwner] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [focusedSide, setFocusedSide] = useState<'left' | 'right'>('left');
  const leftPageRef = useRef<any>(null);
  const rightPageRef = useRef<any>(null);

  // Mobile sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getActiveRef = () => focusedSide === 'left' ? leftPageRef : rightPageRef;

  // Inline creation state
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [showNewChapter, setShowNewChapter] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [showNewPage, setShowNewPage] = useState<string | null>(null);

  useEffect(() => { fetchBookData(); }, [id]);

  // Close sidebar on route change
  useEffect(() => { setSidebarOpen(false); }, [id]);

  const fetchBookData = async () => {
    try {
      setLoading(true);
      const [bookRes, chapterRes] = await Promise.all([
        api.get(`/books/${id}`),
        api.get(`/chapters/book/${id}`)
      ]);
      
      const bookData = bookRes.data;
      setBook(bookData);
      setIsOwner(user && bookData.userId === (user as any).id);

      const fetchedChapters: any[] = chapterRes.data;
      setChapters(fetchedChapters);

      if (fetchedChapters.length > 0) {
        const firstId = fetchedChapters[0]._id;
        setActiveChapterId(firstId);
        const pageRes = await api.get(`/pages/chapter/${firstId}`);
        setPages(pageRes.data);
      }
      setTimeout(() => setLoading(false), 600);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const togglePrivacy = async () => {
    try {
      const res = await api.patch(`/books/${id}/public`);
      setBook(res.data);
    } catch (err) {
      console.error('Failed to toggle privacy', err);
    }
  };

  const fetchPagesForChapter = async (chapterId: string) => {
    try {
      setActiveChapterId(chapterId);
      setCurrentIndex(0);
      const res = await api.get(`/pages/chapter/${chapterId}`);
      setPages(res.data);
      setSidebarOpen(false); // auto-close on mobile
    } catch (err) { console.error(err); }
  };

  const handleSaveContent = async (pageId: string, content: string, date: string, fontColor: string, images: any[] = [], tables: any[] = []) => {
    try {
      await api.patch(`/pages/${pageId}`, { content, date, fontColor, images, tables });
      setPages((prev: any[]) =>
        prev.map((p: any) =>
          p._id === pageId ? { ...p, content, date, fontColor, images, tables, lastSavedAt: new Date() } : p
        )
      );
    } catch (err) {
      console.error('Save failed', err);
    }
  };

  const submitChapter = async () => {
    const title = newChapterTitle.trim();
    if (!title) return;
    try {
      const res = await api.post('/chapters', { title, bookId: id });
      const created = res.data;
      setChapters(prev => [...prev, created]);
      setActiveChapterId(created._id);
      setPages([]);
      setCurrentIndex(0);
      setNewChapterTitle('');
      setShowNewChapter(false);
    } catch (err) { console.error(err); }
  };

  const submitPage = async (chapterId: string) => {
    const title = newPageTitle.trim() || 'Page';
    try {
      const res = await api.post('/pages', { title, chapterId });
      if (chapterId === activeChapterId) {
        setPages(prev => [...prev, res.data]);
      }
      setNewPageTitle('');
      setShowNewPage(null);
    } catch (err) { console.error(err); }
  };

  const goNext = () => {
    if (currentIndex + 2 < pages.length) setCurrentIndex(i => i + 2);
  };
  const goPrev = () => {
    if (currentIndex > 0) setCurrentIndex(i => i - 2);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(d => !d);
    document.body.classList.toggle('dark');
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center text-stone-400 bg-[#1c1917] font-serif italic">
      <Loader2 className="w-10 h-10 animate-spin mb-4 text-stone-600" />
      <p className="animate-pulse tracking-widest text-xs uppercase">Opening your Archive…</p>
    </div>
  );

  const hasPages = pages.length > 0;
  const totalSpreads = Math.ceil(pages.length / 2);
  const currentSpread = Math.floor(currentIndex / 2) + 1;

  return (
    <div className="h-[100dvh] bg-[#121212] dark:bg-[#050505] flex flex-col transition-colors duration-500">

      {/* ── Top Bar ── */}
      <div className="h-14 bg-[#1a1a1a] dark:bg-[#0a0a0a] border-b border-white/5 flex items-center justify-between px-3 sm:px-5 shrink-0 z-30">
        
        {/* Left Side */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mobile sidebar toggle */}
          <button
            onClick={() => setSidebarOpen(v => !v)}
            className="md:hidden p-2 text-stone-400 hover:text-white transition-colors rounded"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-stone-400 hover:text-white transition-colors font-serif italic text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Return to Study</span>
          </button>
        </div>

        {/* Center Tools — owner only, hidden on very small screens */}
        {isOwner && (
          <div className="hidden sm:flex items-center bg-white/5 border border-white/10 rounded-lg px-2 py-1 shadow-inner topbar-tools">
            <div className="flex items-center gap-1 pr-3 border-r border-white/10">
              <button
                onClick={() => getActiveRef().current?.addBulletPoints()}
                title="Bullet Points"
                className="p-2 text-stone-400 hover:text-indigo-400 hover:bg-white/5 rounded transition-all"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => getActiveRef().current?.centerLines()}
                title="Center Text"
                className="p-2 text-stone-400 hover:text-indigo-400 hover:bg-white/5 rounded transition-all"
              >
                <AlignCenter className="w-4 h-4" />
              </button>
              <button
                onClick={() => getActiveRef().current?.addTable()}
                title="Insert Table"
                className="p-2 text-stone-400 hover:text-emerald-400 hover:bg-white/5 rounded transition-all"
              >
                <TableIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => getActiveRef().current?.openPen()}
                title="Virtual Pen"
                className="p-2 text-stone-400 hover:text-indigo-400 hover:bg-white/5 rounded transition-all"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex items-center gap-2 pl-3">
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded text-[9px] uppercase tracking-widest text-indigo-400 font-bold">
                <span className={`w-1.5 h-1.5 rounded-full ${focusedSide === 'left' ? 'bg-indigo-400 animate-pulse' : 'bg-stone-600'}`} />
                L
              </div>
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded text-[9px] uppercase tracking-widest text-indigo-400 font-bold">
                <span className={`w-1.5 h-1.5 rounded-full ${focusedSide === 'right' ? 'bg-indigo-400 animate-pulse' : 'bg-stone-600'}`} />
                R
              </div>
              <span className="hidden lg:inline text-[10px] text-stone-500 font-serif italic ml-1">Editing Mode</span>
            </div>
          </div>
        )}

        {/* Mobile Tools Row — owner only, shown as simple icon row */}
        {isOwner && (
          <div className="flex sm:hidden items-center gap-1">
            <button onClick={() => getActiveRef().current?.addBulletPoints()} title="Bullets" className="p-2 text-stone-400 hover:text-indigo-400 rounded">
              <List className="w-4 h-4" />
            </button>
            <button onClick={() => getActiveRef().current?.addTable()} title="Table" className="p-2 text-stone-400 hover:text-emerald-400 rounded">
              <TableIcon className="w-4 h-4" />
            </button>
            <button onClick={() => getActiveRef().current?.openPen()} title="Pen" className="p-2 text-stone-400 hover:text-indigo-400 rounded">
              <Pencil className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Right Side */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Page count — hidden on xs */}
          <select
            value={pageCount}
            onChange={e => setPageCount(Number(e.target.value))}
            className="hidden sm:block bg-transparent border border-white/10 text-xs text-stone-400 px-3 py-1 rounded-sm outline-none font-serif italic cursor-pointer"
          >
            <option value={80}  className="bg-[#1a1a1a]">80 pg</option>
            <option value={120} className="bg-[#1a1a1a]">120 pg</option>
            <option value={160} className="bg-[#1a1a1a]">160 pg</option>
            <option value={200} className="bg-[#1a1a1a]">200 pg</option>
          </select>

          <button onClick={toggleDarkMode} className="p-1.5 text-stone-500 hover:text-indigo-400 transition-colors">
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {isOwner && (
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-1.5 text-xs bg-white/5 text-stone-400 hover:text-white px-2 sm:px-3 py-1.5 border border-white/10 transition-all font-serif rounded-sm"
            >
              <Share2 className="w-3 h-3" />
              <span className="hidden sm:inline">Share</span>
            </button>
          )}

          {isOwner && (
            <button
              onClick={() => setShowNewChapter(v => !v)}
              className="flex items-center gap-1.5 text-xs bg-white/5 text-stone-400 hover:text-white px-2 sm:px-3 py-1.5 border border-white/10 transition-all font-serif rounded-sm"
            >
              <Plus className="w-3 h-3" />
              <span className="hidden sm:inline">New Chapter</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Inline New Chapter form ── */}
      {showNewChapter && (
        <div className="bg-[#1a1a1a] border-b border-white/5 px-3 sm:px-5 py-3 flex items-center gap-3 z-20">
          <input
            autoFocus
            value={newChapterTitle}
            onChange={e => setNewChapterTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submitChapter()}
            placeholder="Chapter title…"
            className="flex-1 bg-white/5 border border-white/10 text-stone-200 px-3 py-1.5 text-sm font-serif outline-none rounded-sm placeholder:text-stone-600"
          />
          <button onClick={submitChapter} className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-sm transition-colors font-serif shrink-0">
            Create
          </button>
          <button onClick={() => setShowNewChapter(false)} className="text-xs text-stone-500 hover:text-white px-3 py-1.5 transition-colors shrink-0">
            Cancel
          </button>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden relative">

        {/* ── Mobile Sidebar Overlay ── */}
        <div
          className={`sidebar-overlay md:hidden ${sidebarOpen ? 'active' : ''}`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* ── Sidebar ── */}
        <div className={`sidebar-drawer md:relative md:translate-x-0 w-64 bg-[#161616] border-r border-white/5 flex flex-col overflow-hidden ${sidebarOpen ? 'open' : ''}`}>
          <div className="px-4 pt-5 pb-3 flex items-center justify-between">
            <p className="text-[10px] font-bold text-stone-600 uppercase tracking-[0.2em]">Table of Contents</p>
            <button className="md:hidden text-stone-600 hover:text-white" onClick={() => setSidebarOpen(false)}>
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 pb-4">
            {chapters.length === 0 ? (
              <div className="text-center mt-8 px-4">
                <BookOpen className="w-8 h-8 text-stone-700 mx-auto mb-3" />
                <p className="text-xs text-stone-600 font-serif italic leading-relaxed">
                  No chapters yet.<br />Click <strong className="text-stone-500">New Chapter</strong> above to begin.
                </p>
              </div>
            ) : (
              chapters.map((chapter: any) => {
                const isActive = activeChapterId === chapter._id;
                return (
                  <div key={chapter._id} className="mb-3">
                    <div
                      onClick={() => fetchPagesForChapter(chapter._id)}
                      className={`flex items-center justify-between px-3 py-2 rounded-sm cursor-pointer transition-colors ${
                        isActive
                          ? 'bg-white/10 text-white border-l-2 border-indigo-500'
                          : 'text-stone-400 hover:text-stone-200 hover:bg-white/5 border-l-2 border-transparent'
                      }`}
                    >
                      <span className="flex items-center gap-2 text-sm font-serif italic truncate font-semibold">
                        <List className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-indigo-400' : 'text-stone-600'}`} />
                        {chapter.title}
                      </span>
                    </div>

                    {isActive && (
                      <div className="pl-6 pr-3 mt-1 flex flex-col gap-1">
                        <div className="flex flex-col gap-0.5 mb-2">
                          {pages.map((page: any, idx: number) => {
                            const isPageInCurrentSpread = idx === currentIndex || idx === currentIndex + 1;
                            return (
                              <div
                                key={page._id}
                                onClick={() => { setCurrentIndex(Math.floor(idx / 2) * 2); setSidebarOpen(false); }}
                                className={`group flex items-center justify-between px-2 py-1.5 rounded-sm cursor-pointer transition-all ${
                                  isPageInCurrentSpread 
                                    ? 'bg-indigo-500/10 text-indigo-400' 
                                    : 'text-stone-500 hover:text-stone-300 hover:bg-white/5'
                                }`}
                              >
                                <div className="flex items-center gap-2 overflow-hidden">
                                  <FileText className={`w-3 h-3 shrink-0 ${isPageInCurrentSpread ? 'text-indigo-400' : 'text-stone-700 group-hover:text-stone-500'}`} />
                                  <span className="text-[11px] font-serif truncate">
                                    {page.title || `Page ${idx + 1}`}
                                  </span>
                                </div>
                                {isPageInCurrentSpread && (
                                  <div className="w-1 h-1 rounded-full bg-indigo-500 shrink-0" />
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {!showNewPage && isOwner && (
                          <button
                            onClick={(e) => { e.stopPropagation(); setShowNewPage(chapter._id); setNewPageTitle(''); }}
                            className="flex items-center gap-1.5 text-[10px] text-stone-500 hover:text-indigo-400 py-1 px-2 transition-colors w-full text-left border border-dashed border-white/5 hover:border-indigo-500/30 rounded-sm"
                          >
                            <Plus className="w-3 h-3" /> Add new page
                          </button>
                        )}
                        
                        {showNewPage === chapter._id && (
                          <div className="flex flex-col gap-1.5 mt-1 bg-black/20 p-2 rounded-sm border border-white/5">
                            <input
                              autoFocus
                              value={newPageTitle}
                              onChange={e => setNewPageTitle(e.target.value)}
                              onKeyDown={e => e.key === 'Enter' && submitPage(chapter._id)}
                              placeholder="Page title…"
                              className="w-full bg-black/40 border border-white/10 text-stone-200 px-2 py-1 text-xs font-serif outline-none rounded-sm placeholder:text-stone-700 focus:border-indigo-500/50"
                            />
                            <div className="flex gap-1">
                              <button onClick={() => submitPage(chapter._id)} className="flex-1 text-[10px] bg-indigo-600 hover:bg-indigo-500 text-white py-1 rounded-sm transition-colors">
                                Add
                              </button>
                              <button onClick={() => setShowNewPage(null)} className="text-[10px] text-stone-500 hover:text-white px-2 py-1 transition-colors bg-white/5 rounded-sm">
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Page navigation at bottom of sidebar */}
          {hasPages && (
            <div className="border-t border-white/5 px-4 py-3 flex items-center justify-between">
              <button
                onClick={goPrev}
                disabled={currentIndex === 0}
                className="p-1.5 rounded-sm text-stone-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[10px] text-stone-600 font-serif italic">
                {currentSpread} / {totalSpreads}
              </span>
              <button
                onClick={goNext}
                disabled={currentIndex + 2 >= pages.length}
                className="p-1.5 rounded-sm text-stone-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* ── Main Book Area ── */}
        <div className="flex-1 flex flex-col items-center justify-center bg-black/30 overflow-hidden min-w-0">

          {chapters.length === 0 && (
            <div className="text-center px-6 sm:px-8">
              <BookOpen className="w-12 sm:w-16 h-12 sm:h-16 text-stone-800 mx-auto mb-4" />
              <h2 className="text-xl sm:text-2xl font-serif text-stone-500 mb-2">Your book is empty</h2>
              <p className="text-stone-600 font-serif italic text-sm mb-6">Create a chapter first, then add pages to start writing.</p>
              <button
                onClick={() => setShowNewChapter(true)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-sm font-serif transition-colors mx-auto"
              >
                <Plus className="w-4 h-4" /> Create First Chapter
              </button>
            </div>
          )}

          {chapters.length > 0 && !hasPages && (
            <div className="text-center px-6 sm:px-8">
              <FileText className="w-12 sm:w-16 h-12 sm:h-16 text-stone-800 mx-auto mb-4" />
              <h2 className="text-xl sm:text-2xl font-serif text-stone-500 mb-2">No pages yet</h2>
              <p className="text-stone-600 font-serif italic text-sm mb-6">
                Click <strong>Add new page</strong> in the sidebar, or click below.
              </p>
              {activeChapterId && isOwner && (
                <button
                  onClick={() => { setShowNewPage(activeChapterId); setNewPageTitle(''); setSidebarOpen(true); }}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-sm font-serif transition-colors mx-auto"
                >
                  <Plus className="w-4 h-4" /> Add First Page
                </button>
              )}
            </div>
          )}

          {hasPages && (
            <BookViewer
              leftPage={pages[currentIndex]}
              rightPage={pages[currentIndex + 1]}
              onNext={goNext}
              onPrev={goPrev}
              onSave={isOwner ? handleSaveContent : undefined}
              pageCount={pageCount}
              readOnly={!isOwner}
              leftRef={leftPageRef}
              rightRef={rightPageRef}
              onPageFocus={(side) => setFocusedSide(side)}
            />
          )}
        </div>
      </div>

      {/* ── Share Modal ── */}
      {showShareModal && (
        <div className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="share-modal w-full sm:max-w-md bg-[#1a1a1a] border border-white/10 sm:rounded-xl shadow-2xl overflow-hidden font-serif">
            <div className="p-5 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Share2 className="w-5 h-5 text-indigo-400" /> Share your work
              </h3>
              <button onClick={() => setShowShareModal(false)} className="text-stone-500 hover:text-white transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 space-y-5">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5">
                <div className="flex items-center gap-3">
                  {book?.isPublic ? <Globe className="w-5 h-5 text-emerald-400" /> : <Lock className="w-5 h-5 text-stone-500" />}
                  <div>
                    <p className="text-sm font-bold text-white">{book?.isPublic ? 'Publicly Shared' : 'Private Book'}</p>
                    <p className="text-xs text-stone-500">{book?.isPublic ? 'Anyone with the link can view.' : 'Only you can see this.'}</p>
                  </div>
                </div>
                <button
                  onClick={togglePrivacy}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                    book?.isPublic 
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20' 
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                  }`}
                >
                  {book?.isPublic ? 'Make Private' : 'Go Public'}
                </button>
              </div>

              {book?.isPublic && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-stone-500 uppercase tracking-widest">Share Link</p>
                  <div className="flex gap-2">
                    <input 
                      readOnly 
                      value={window.location.href}
                      className="flex-1 bg-black/40 border border-white/10 rounded px-3 py-2 text-sm text-stone-300 outline-none min-w-0"
                    />
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        showToast('Link copied to clipboard!', 'success');
                      }}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded transition-colors shrink-0"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookPage;
