import React from 'react';
import PropTypes from 'prop-types';

import List from 'react-md/lib/Lists/List';

class ItemList extends React.PureComponent {
    render() {
        return (
            <List>
                {Array.from(this.props.items, ([itemId, item]) => {
                    const ItemComponent = this.props.itemComponent;

                    return <ItemComponent key={item.getIdentifier()} item={item}/>
                })}
            </List>
        );
    }
}

ItemList.propTypes = {
    items: PropTypes.instanceOf(Map).isRequired,
    itemComponent: PropTypes.any.isRequired
};

export default ItemList;