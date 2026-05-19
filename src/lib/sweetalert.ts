import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const showAlert = {
  success: (title: string, text?: string) => {
    return MySwal.fire({
      icon: 'success',
      title,
      text,
      confirmButtonText: 'حسناً',
      confirmButtonColor: '#4880FF',
    });
  },
  error: (title: string, text?: string) => {
    return MySwal.fire({
      icon: 'error',
      title,
      text,
      confirmButtonText: 'حسناً',
      confirmButtonColor: '#4880FF',
    });
  },
  warning: (title: string, text?: string) => {
    return MySwal.fire({
      icon: 'warning',
      title,
      text,
      confirmButtonText: 'حسناً',
      confirmButtonColor: '#4880FF',
    });
  },
  confirm: (title: string, text?: string) => {
    return MySwal.fire({
      icon: 'question',
      title,
      text,
      showCancelButton: true,
      confirmButtonText: 'نعم',
      cancelButtonText: 'إلغاء',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#4880FF',
    });
  },
};
