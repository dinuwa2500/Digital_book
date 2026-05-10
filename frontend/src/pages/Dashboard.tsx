import { useState, useEffect } from "react";
import { Plus, Book as BookIcon, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Adsterra from "../components/Ads/Adsterra";

const Dashboard = () => {
  const [books, setBooks] = useState([]);
  const { logout, user } = useAuth();

  useEffect(() => {
    fetchBooks();
    document.title = "My Library | Digital Exercise Book";
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await api.get("/books");
      setBooks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const createBook = async () => {
    const { value: title } = await Swal.fire({
      title: "Create New Volume",
      input: "text",
      inputLabel: "What shall we call this new record?",
      inputPlaceholder: "e.g. Theoretical Physics, 2026 Diary...",
      background: "#1c1917",
      color: "#fff",
      confirmButtonColor: "#4f46e5",
      confirmButtonText: "Initialize Volume",
      inputAttributes: { autocapitalize: "off" },
      showCancelButton: true,
      customClass: {
        popup: "rounded-xl border border-white/10 font-serif",
        input: "bg-black/40 border-white/10 text-white rounded-lg px-4 py-2",
      },
    });

    if (title) {
      try {
        await api.post("/books", { title });
        fetchBooks();
        Swal.fire({
          icon: "success",
          title: "Volume Created",
          text: `"${title}" has been added to your library.`,
          background: "#1c1917",
          color: "#fff",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className='min-h-screen p-4 sm:p-8 bg-[#1c1917]'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <header className='dashboard-header flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8 border-b border-white/10 pb-6 sm:pb-8'>
          <div>
            <h1 className='text-4xl sm:text-5xl font-serif text-white mb-1 sm:mb-2'>
              My Study
            </h1>
            <p className='text-stone-500 font-serif italic text-sm'>
              Welcome back, {user?.username}. Your library awaits.
            </p>
          </div>
          <div className='dashboard-actions flex items-center gap-3'>
            <button
              onClick={createBook}
              className='flex-1 sm:flex-none flex items-center justify-center gap-2 bg-stone-800 text-stone-300 border border-stone-700 px-5 py-2.5 rounded-sm hover:bg-stone-700 transition-colors font-serif text-sm'
            >
              <Plus className='w-4 h-4' /> Add New Volume
            </button>
            <button
              onClick={logout}
              className='p-2.5 text-stone-500 hover:text-white transition-colors border border-white/5 rounded-sm'
              aria-label='Log out'
            >
              <LogOut className='w-5 h-5' />
            </button>
          </div>
        </header>

        {/* Top Ads Section */}
        <div className='mb-2 mt-2 flex flex-col gap-2 items-center'>
          <Adsterra id='2604f27bec8c20d84e78ee4fcc689930' format='728x90' />
        </div>

        {/* Bookshelf */}
        <div className='relative pb-8'>
          {books.length === 0 ? (
            <div className='text-center py-20'>
              <BookIcon className='w-16 h-16 text-stone-700 mx-auto mb-4' />
              <p className='text-stone-500 font-serif italic'>
                Your library is empty. Create your first volume.
              </p>
              <button
                onClick={createBook}
                className='mt-6 inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-sm font-serif transition-colors'
              >
                <Plus className='w-4 h-4' /> Create First Volume
              </button>
            </div>
          ) : (
            <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-x-8 sm:gap-y-20'>
              {books.map((book: any) => (
                <Link
                  key={book._id}
                  to={`/book/${book._id}`}
                  className='group relative h-56 sm:h-80 bg-stone-900 border-l-8 border-stone-800 rounded-r-lg transition-all hover:scale-105 cursor-pointer flex flex-col justify-between overflow-hidden shadow-xl hover:shadow-2xl'
                  style={{ boxShadow: "4px 6px 20px rgba(0,0,0,0.5)" }}
                >
                  {/* Book Spine */}
                  <div className='absolute inset-y-0 left-0 w-2 bg-gradient-to-r from-black/40 to-transparent' />

                  <div className='p-4 sm:p-6 h-full flex flex-col'>
                    <div className='flex justify-center mb-4 sm:mb-8 opacity-20 group-hover:opacity-40 transition-opacity'>
                      <BookIcon className='w-10 sm:w-16 h-10 sm:h-16 text-stone-100' />
                    </div>
                    <h3 className='text-base sm:text-xl font-serif text-stone-200 text-center leading-tight line-clamp-3'>
                      {book.title}
                    </h3>
                  </div>

                  <div className='p-3 sm:p-4 bg-stone-800/50 border-t border-white/5 text-[9px] sm:text-[10px] uppercase tracking-widest text-stone-500 text-center'>
                    Volume I
                  </div>

                  {/* Leather texture */}
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/leather.png')] opacity-10 pointer-events-none" />
                </Link>
              ))}
            </div>
          )}

          {/* Wooden Shelf Line */}
          {books.length > 0 && (
            <>
              <div className='absolute -bottom-4 left-0 right-0 h-4 bg-[#3d2b1f] shadow-2xl rounded-sm' />
              <div className='absolute -bottom-8 left-0 right-0 h-2 bg-black/40 blur-sm' />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
