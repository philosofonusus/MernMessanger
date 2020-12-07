import React from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom"

// Pages
import Home from "../pages/Home"
import Authentication from "../pages/Authentication"
import { Builder } from "../pages/Builder"
import { MessageProvider } from "../context/MessageContext"

const Router = () => (
   <BrowserRouter>
      <Switch>
         <Route path='/messages' component={MessageProvider} />
         <Route path='/authenticate' exact component={Authentication} />
         <Route path='/builder' exact component={Builder} />
         <Route path='*' component={Home} />
      </Switch>
   </BrowserRouter >
)

export default Router;
