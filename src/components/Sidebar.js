import React from 'react';
import PropTypes from 'prop-types';

import UserSidebarWidget from 'Screens/user';
import ProductListCollectionSidebarWidget from 'Screens/productListCollection';

class Sidebar extends React.PureComponent {
    render() {
        return (
            <div>
                <UserSidebarWidget/>
                <ProductListCollectionSidebarWidget/>
            </div>
        );
    }
}


export default Sidebar;