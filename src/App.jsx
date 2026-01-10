import React from 'react'
import AppRoutes from './routes/AppRoutes'
import ToastifyContainer from './components/user/ToastifyContainer';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <>
      <ScrollToTop />
      <AppRoutes />
      <ToastifyContainer />

    </>
  )
}

export default App;
