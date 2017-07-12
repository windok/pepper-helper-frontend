import React from 'react';
import PropTypes from 'prop-types';

import {ListItem} from 'Models/ListItem';

class InvisibleItem extends React.PureComponent {
    render() {
        return (
            <span></span>
        )
    }
}

InvisibleItem.propTypes = {
    item: PropTypes.instanceOf(ListItem).isRequired,
};

export default InvisibleItem;
