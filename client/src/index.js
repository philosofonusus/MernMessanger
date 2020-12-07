import React from 'react';
import ReactDOM from 'react-dom';
import Router from "./router/router"

// Context providers
import { AuthProvider } from "./context/AuthContext"

import "./assets/scss/index.scss"

ReactDOM.render(
   <AuthProvider>
      <Router />
   </AuthProvider>,
   document.getElementById('root')
);