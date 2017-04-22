import React from 'react';
import { Link } from 'react-router';

const NavLink = (props) => (
    <Link
        to={props.to}
        activeStyle={{
            textDecoration: 'none',
            color: 'black',
        }}
    >
        {props.children}
    </Link>
);

export default NavLink;