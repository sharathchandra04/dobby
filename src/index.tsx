// import React from 'react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import "react-bootstrap/dist/react-bootstrap.min.js";
import Router from './Router/router';
// import axios from 'axios';

// axios.interceptors.response.use((response: any) => {
//     return response;
//  }, (error: any) => {
//     if(error.response.status == 401){
//         localStorage.clear();
//         location.replace("/")
//     }
//     return Promise.reject(error);
//  });

import { Provider } from 'react-redux';
import store from './redux/store';

ReactDOM.render(
    <Provider store={store}>
        <React.StrictMode>
            <Router />
        </React.StrictMode> 
    </Provider>,
    document.getElementById('root')
);
