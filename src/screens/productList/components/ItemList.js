import React from 'react';
import PropTypes from 'prop-types';

import Moment from 'moment';

import {STATUS_DRAFT, STATUS_BOUGHT, TYPE_RECOMMENDED} from 'Models/ListItem';

import List from 'react-md/lib/Lists/List';

import DraftItem from './DraftItem';
import BoughtItem from './BoughtItem';
import SuspendedItem from './SuspendedItem';
import RecommendedItem from './RecommendedItem';
import InvisibleItem from './InvisibleItem';

class ItemList extends React.PureComponent {
    getItemComponent(listItem) {
        let correspondingItemComponent = InvisibleItem;

        const today = Moment.utc();
        const nextDay = Moment.utc(today.add(1, 'day').format('YYYY-MM-DD'), 'YYYY-MM-DD');
        const isItemActual = nextDay.isAfter(listItem.getDate());

        switch (listItem.getType()) {
            case TYPE_RECOMMENDED:
                correspondingItemComponent = isItemActual ? RecommendedItem : InvisibleItem;
                break;
            default:
                switch (listItem.getStatus()) {
                    case STATUS_DRAFT:
                        correspondingItemComponent = isItemActual ? DraftItem : SuspendedItem;
                        break;
                    case STATUS_BOUGHT:
                        correspondingItemComponent = BoughtItem;
                        break;
                }
                break;
        }

        return this.props.itemComponent === correspondingItemComponent ? correspondingItemComponent : InvisibleItem;
    }

    render() {
        return (
            <List>
                {Array.from(this.props.items, ([itemId, item]) => {
                    const ItemComponent = this.getItemComponent(item);
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