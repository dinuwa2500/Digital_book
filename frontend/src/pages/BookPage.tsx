import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import BookViewer from '../components/Book/BookViewer';
import {
  ChevronLeft, Plus, List, Moon, Sun, Loader2,
  BookOpen, FileText, ChevronRight, Share2, Globe, Lock,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../utils/alerts';
import Swal from 'sweetalert2';

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

  // Inline creation state
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [showNewChapter, setShowNewChapter] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [showNewPage, setShowNewPage] = useState<string | null>(null); // stores chapterId

  // ─── Load data ───────────────────────────────────────────────
  useEffect(() => { fetchBookData(); }, [id]);

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
    } catch (err) { console.error(err); }
  };

  // ─── Save ─────────────────────────────────────────────────────
  const handleSaveContent = async (pageId: string, content: string, date: string, fontColor: string, images: any[] = []) => {
    try {
      await api.patch(`/pages/${pageId}`, { content, date, fontColor, images });
      setPages((prev: any[]) =>
        prev.map((p: any) =>
          p._id === pageId ? { ...p, content, date, fontColor, images, lastSavedAt: new Date() } : p
        )
      );
    } catch (err) {
      console.error('Save failed', err);
    }
  };

  // ─── Create Chapter ───────────────────────────────────────────
  const submitChapter = async () => {
    const title = newChapterTitle.trim();
    if (!title) return;
    try {
      const res = await api.post('/chapters', { title, bookId: id });
      const created = res.data;
      setChapters(prev => [...prev, created]);
      setActiveChapterId(created._id);
      setPages([]); // new chapter has no pages yet
      setCurrentIndex(0);
      setNewChapterTitle('');
      setShowNewChapter(false);
    } catch (err) { console.error(err); }
  };

  // ─── Create Page ──────────────────────────────────────────────
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

  // ─── Navigation ───────────────────────────────────────────────
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

  // ─── Loading screen ───────────────────────────────────────────
  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center text-stone-400 bg-[#1c1917] font-serif italic">
      <Loader2 className="w-10 h-10 animate-spin mb-4 text-stone-600" />
      <p className="animate-pulse tracking-widest text-xs uppercase">Opening your Archive…</p>
    </div>
  );

  // ─── Helpers ──────────────────────────────────────────────────
  const hasPages = pages.length > 0;
  const totalSpreads = Math.ceil(pages.length / 2);
  const currentSpread = Math.floor(currentIndex / 2) + 1;

  return (
    <div className="h-screen bg-[#121212] dark:bg-[#050505] flex flex-col transition-colors duration-500">

      {/* ── Top Bar ── */}
      <div className="h-14 bg-[#1a1a1a] dark:bg-[#0a0a0a] border-b border-white/5 flex items-center justify-between px-5 shrink-0">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors font-serif italic text-sm">
          <ChevronLeft className="w-4 h-4" /> Return to Study
        </button>

        <div className="flex items-center gap-4">
          {/* Page count selector */}
          <select
            value={pageCount}
            onChange={e => setPageCount(Number(e.target.value))}
            className="bg-transparent border border-white/10 text-xs text-stone-400 px-3 py-1 rounded-sm outline-none font-serif italic cursor-pointer"
          >
            <option value={80}  className="bg-[#1a1a1a]">80 Pages</option>
            <option value={120} className="bg-[#1a1a1a]">120 Pages</option>
            <option value={160} className="bg-[#1a1a1a]">160 Pages</option>
            <option value={200} className="bg-[#1a1a1a]">200 Pages</option>
          </select>

          {/* Night mode */}
          <button onClick={toggleDarkMode} className="p-1.5 text-stone-500 hover:text-indigo-400 transition-colors">
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Share Button */}
          {isOwner && (
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-1.5 text-xs bg-white/5 text-stone-400 hover:text-white px-3 py-1.5 border border-white/10 transition-all font-serif rounded-sm"
            >
              <Share2 className="w-3 h-3" /> Share
            </button>
          )}

          {/* New Chapter */}
          {isOwner && (
            <button
              onClick={() => setShowNewChapter(v => !v)}
              className="flex items-center gap-1.5 text-xs bg-white/5 text-stone-400 hover:text-white px-3 py-1.5 border border-white/10 transition-all font-serif rounded-sm"
            >
              <Plus className="w-3 h-3" /> New Chapter
            </button>
          )}
        </div>
      </div>

      {/* ── Inline New Chapter form ── */}
      {showNewChapter && (
        <div className="bg-[#1a1a1a] border-b border-white/5 px-5 py-3 flex items-center gap-3">
          <input
            autoFocus
            value={newChapterTitle}
            onChange={e => setNewChapterTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submitChapter()}
            placeholder="Chapter title…"
            className="flex-1 bg-white/5 border border-white/10 text-stone-200 px-3 py-1.5 text-sm font-serif outline-none rounded-sm placeholder:text-stone-600"
          />
          <button onClick={submitChapter} className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-sm transition-colors font-serif">
            Create
          </button>
          <button onClick={() => setShowNewChapter(false)} className="text-xs text-stone-500 hover:text-white px-3 py-1.5 transition-colors">
            Cancel
          </button>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">

        {/* ── Sidebar ── */}
        <div className="w-64 bg-[#161616] border-r border-white/5 flex flex-col overflow-hidden">
          <div className="px-5 pt-5 pb-3">
            <p className="text-[10px] font-bold text-stone-600 uppercase tracking-[0.2em]">Table of Contents</p>
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
                    {/* Chapter row */}
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

                    {/* Active Chapter Controls & Pages List */}
                    {isActive && (
                      <div className="pl-6 pr-3 mt-1 flex flex-col gap-1">
                        {/* List of actual pages */}
                        <div className="flex flex-col gap-0.5 mb-2">
                          {pages.map((page: any, idx: number) => {
                            const isPageInCurrentSpread = idx === currentIndex || idx === currentIndex + 1;
                            return (
                              <div
                                key={page._id}
                                onClick={() => setCurrentIndex(Math.floor(idx / 2) * 2)}
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
                                  <div className="w-1 h-1 rounded-full bg-indigo-500" />
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
                        
                        {/* Inline New Page form for this chapter */}
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

          {/* Page navigation controls at bottom of sidebar */}
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
        <div className="flex-1 flex flex-col items-center justify-center bg-black/30 overflow-hidden">

          {/* Empty state: no chapters at all */}
          {chapters.length === 0 && (
            <div className="text-center px-8">
              <BookOpen className="w-16 h-16 text-stone-800 mx-auto mb-4" />
              <h2 className="text-2xl font-serif text-stone-500 mb-2">Your book is empty</h2>
              <p className="text-stone-600 font-serif italic text-sm mb-6">Create a chapter first, then add pages to start writing.</p>
              <button
                onClick={() => setShowNewChapter(true)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-sm font-serif transition-colors mx-auto"
              >
                <Plus className="w-4 h-4" /> Create First Chapter
              </button>
            </div>
          )}

          {/* Empty state: chapter exists but no pages */}
          {chapters.length > 0 && !hasPages && (
            <div className="text-center px-8">
              <FileText className="w-16 h-16 text-stone-800 mx-auto mb-4" />
              <h2 className="text-2xl font-serif text-stone-500 mb-2">No pages yet</h2>
              <p className="text-stone-600 font-serif italic text-sm mb-6">
                Click <strong>Add new page</strong> under the active chapter in the sidebar,<br/>or click below.
              </p>
              {activeChapterId && isOwner && (
                <button
                  onClick={() => { setShowNewPage(activeChapterId); setNewPageTitle(''); }}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-sm font-serif transition-colors mx-auto"
                >
                  <Plus className="w-4 h-4" /> Add First Page
                </button>
              )}
            </div>
          )}

          {/* Book Viewer — only when pages exist */}
          {hasPages && (
            <BookViewer
              leftPage={pages[currentIndex]}
              rightPage={pages[currentIndex + 1]}
              onNext={goNext}
              onPrev={goPrev}
              onSave={isOwner ? handleSaveContent : undefined}
              pageCount={pageCount}
              readOnly={!isOwner}
            />
          )}
        </div>
      </div>

      {/* ── Share Modal ── */}
      {showShareModal && (
        <div className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden font-serif">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Share2 className="w-5 h-5 text-indigo-400" /> Share your work
              </h3>
              <button onClick={() => setShowShareModal(false)} className="text-stone-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
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
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
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
                      className="flex-1 bg-black/40 border border-white/10 rounded px-3 py-2 text-sm text-stone-300 outline-none"
                    />
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        showToast('Link copied to clipboard!', 'success');
                      }}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded transition-colors"
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
