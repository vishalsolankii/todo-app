import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Login from './Login';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

class App extends React.Component {
  render() {
    return (


<div className="App">
 <h2>Helloo this is first react app </h2>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>

       );
  }
}
class Log extends React.Component {
  render() {
    return (

          <Router>
            <div>
             
               <ul>
              
                  <li><Link to={'/Login'}>Login</Link></li>
                  
               </ul>
               <hr/>
                  
                    <Route path='/Login' component={Login} />
             
            </div>

         </Router>


       );
  }
}
class App3 extends React.Component {
  render() {
    return (
    <div>
     <App2/>
     <App/>
     
    
      </div>
    );
  }
}

class App2 extends React.Component {
  render() {
    return (
      
      <div>
      
      <h1>second Component</h1>
      <form>
        <label>name</label><input type="text"  id="name"/>
         <label>email</label><input type="text" id="email"/>
          <label>add</label><input type="text"  id="add"/>
          <input type="submit" value="submit"/>
      </form>
       
      </div>
    );
  }
}

export default App3;
