import React from 'react';
import PropTypes from 'prop-types';

import Sidebar from 'Components/Sidebar';
import Header from 'Components/Header';
import MenuButton from 'Components/buttons/MenuButton';


class NoList extends React.PureComponent {
    render() {
        return (
            <div>
                <Sidebar/>
                <Header
                    title=''
                    leftLinks={<MenuButton key="void"/>}
                />
            </div>
        );
    }
}

export default NoList;