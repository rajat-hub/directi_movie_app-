import React from 'react';
import { Redirect } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Logout() {
  const isLogged =
    localStorage.getItem('User') && localStorage.getItem('TMDB_session_id');
  if (isLogged) {
    localStorage.removeItem('User');
    localStorage.removeItem('TMDB_session_id');
    NotificationManager.success(
      'You have added a new book!',
      'Successful!',
      2000
    );
    toast.success('logout successfully');
  }
  return <Redirect to="/" />;
}

export default Logout;
