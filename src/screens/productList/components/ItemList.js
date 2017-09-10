import React from 'react';
import PropTypes from 'prop-types';

import {STATUS_DRAFT, STATUS_BOUGHT, TYPE_GENERAL, TYPE_RECOMMENDED} from 'Models/ListItem';

import List from 'react-md/lib/Lists/List';

import DraftItem from './DraftItem';
import BoughtItem from './BoughtItem';
import RecommendedItem from './RecommendedItem';
import InvisibleItem from './InvisibleItem';

class ItemList extends React.PureComponent {
    getItemComponent(listItem) {
        let correspondingItemComponent = InvisibleItem;

        if (listItem.getStatus() === STATUS_DRAFT && listItem.getType() === TYPE_GENERAL) {
            correspondingItemComponent = DraftItem;
        }

        if (listItem.getStatus() === STATUS_BOUGHT && listItem.getType() === TYPE_GENERAL) {
            correspondingItemComponent = BoughtItem;
        }

        if (listItem.getStatus() === STATUS_DRAFT && listItem.getType() === TYPE_RECOMMENDED) {
            correspondingItemComponent = RecommendedItem;
        }

        return correspondingItemComponent;
        // TODO hide non-target items
        //this.props.itemComponent === correspondingItemComponent ? correspondingItemComponent : InvisibleItem;
    }

    render() {
        return (
            <List>
                {Array.from(this.props.items, ([itemId, item]) => {
                    const ItemComponent = this.getItemComponent(item);
                    return <ItemComponent key={item.getId()} item={item}/>
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