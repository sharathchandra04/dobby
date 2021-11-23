import React, {Component, useEffect, useState} from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Header from '../Header/header';
import Search from '../components/search';
import Tests from '../components/tests';
import Login from '../auth/login';


import axios from 'axios';

// axios.interceptors.response.use((response: any) => {
//     return response;
//  }, (error: any) => {
//     console.log(' error -----> ', error)
//     if(error.response.status == 401){
        
//         localStorage.clear();
//         const navigate = useNavigate();
//         navigate('/');
//         // location.replace("/")

//     }
//     return Promise.reject(error);
//  });


function App() {
  

  return (
          <BrowserRouter>
            <RoutesComponent />
          </BrowserRouter>
    );
}

function Users() {
  
  return (
    <div>
      <nav>
        <Link to="me">My Profile</Link>
      </nav>
      <Routes>
        <Route path="/" element={<UsersIndex />} />
        <Route path=":id" element={<UserProfile />} />
        <Route path="me" element={<OwnUserProfile />} />
      </Routes>
    </div>
  );
}
function RoutesComponent(props: any) {
    let navigate = useNavigate();
    let auth = false;
    let authFlag = localStorage.getItem('authenticated') == 'true'
    
    axios.interceptors.response.use((response: any) => {
        return response;
    }, (error: any) => {
        console.log(' error -----> ', error)
        if(error.response.status == 401){
            localStorage.clear();
            navigate('/');
        }
        return Promise.reject(error);
    });
    
    return (
      <div>
        <Header history={navigate} />
        {
          localStorage.getItem('authenticated') == 'true'?
          <Routes>
            <Route path="/" element={<Search history={navigate}/>}/>
            <Route path="/search" element={<Search history={navigate}/>}/>
            <Route path="/test" element={<Tests history={navigate}/>} />
            <Route path="*" element={<Fournotfour />}/>
          </Routes>
          :
          <Routes>
            <Route  path="/" element={<Login history={navigate}/>}/>
            <Route  path="/login" element={<Login history={navigate}/>}/>
          </Routes>  
        }
      </div>
    );
  }
interface myprops{
  history: any;
}
function Fournotfour() {
  return (
      <div>
        <h2>Error 404, path not found</h2>
      </div>
    );
  }

  function Dashboard(myprops: myprops) {
    useEffect(() => {
    },[]);  
    return (
      <div>
        <h2>Dashboard</h2>
      </div>
    );
  }
  function UsersIndex() {
    return (
      <div>
        <h2>UsersIndex</h2>
      </div>
    );
  }
  function UserProfile() {
    return (
      <div>
        <h2>UserProfile</h2>
      </div>
    );
  }
  function OwnUserProfile() {
    return (
      <div>
        <h2>OwnUserProfile</h2>
      </div>
    );
  }

export default App