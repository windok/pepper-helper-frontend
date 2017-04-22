import React from 'react';

import NavLink from '../../components/NavLink';

const DemoActivityRoot = (props) => (
    <div>
        <strong>Demo Activities screen</strong>

        <br/>
        <NavLink to="/demo-activity/create"><button>Create</button></NavLink>
        <br/>

        <div>
            {props.children}
        </div>
    </div>
);

export default DemoActivityRoot;