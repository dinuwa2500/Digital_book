import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  background: '#1c1917',
  color: '#fff',
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  }
});

export const showToast = (title: string, icon: 'success' | 'error' | 'warning' | 'info' = 'success') => {
  Toast.fire({
    icon,
    title
  });
};

export const showAlert = (title: string, text: string, icon: 'success' | 'error' | 'warning' | 'info' = 'info') => {
  return Swal.fire({
    title,
    text,
    icon,
    background: '#1c1917',
    color: '#fff',
    confirmButtonColor: '#4f46e5',
    customClass: {
      popup: 'rounded-xl border border-white/10 font-serif',
      title: 'text-white',
      confirmButton: 'px-6 py-2 rounded-lg font-bold'
    }
  });
};

export const showConfirm = (title: string, text: string) => {
  return Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#374151',
    confirmButtonText: 'Yes, proceed',
    background: '#1c1917',
    color: '#fff',
    customClass: {
      popup: 'rounded-xl border border-white/10 font-serif'
    }
  });
};
