import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const SweetAlert = withReactContent(Swal);

const UseSweetAlert = () => {
  const showSuccessAlert = (title = 'Success!', text = 'A success message') => {
    SweetAlert.fire({
      icon: 'success',
      title,
      text,
      showConfirmButton: true,
      confirmButtonText: 'OK',
      background: '#fff',
      customClass: {
        popup: 'rounded-2xl shadow-soft-xl',
        confirmButton: 'bg-[#34a5b1] text-white', 
      },
    });
  };

  const showErrorAlert = (title = 'Error!', text = 'An error occurred') => {
    SweetAlert.fire({
      icon: 'error',
      title,
      text,
      showConfirmButton: true,
      confirmButtonText: 'OK',
      background: '#fff',
      customClass: {
        popup: 'rounded-2xl shadow-soft-xl',
        confirmButton: 'bg-red-500 text-white', 
      },
    });
  };

  return {
    showSuccessAlert,
    showErrorAlert,
  };
};

export default UseSweetAlert;
