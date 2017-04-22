import React from 'react';

import NavBar from './NavBar';

const Main = (props) => (
    <div>
        <NavBar/>
        <div>
            {props.children}
        </div>
    </div>
);

export default Main;
