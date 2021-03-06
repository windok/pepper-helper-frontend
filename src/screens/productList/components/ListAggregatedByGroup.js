import React from 'react';
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import ExpansionList from 'react-md/lib/ExpansionPanels/ExpansionList';
import ExpansionPanel from 'react-md/lib/ExpansionPanels/ExpansionPanel';
import ItemList from './ItemList';

import {getItemIds, getItemCollectionByGroupForList} from 'Reducers/listItem';
import {getGroupCollection} from 'Reducers/group';

class ListAggregatedByGroup extends React.PureComponent {
    render() {
        return (
            <ExpansionList className="product-list-container">
                {Array.from(this.props.items, (([groupId, itemsByGroup]) => (
                        <ExpansionPanel
                            key={groupId}
                            label={this.props.groups.has(groupId) ? this.props.groups.get(groupId).getName() : 'n/a'}
                            headerStyle={{backgroundColor: this.props.groups.has(groupId) ? this.props.groups.get(groupId).getColor() : 'transparent'}}
                            secondaryLabel=""
                            defaultExpanded
                            overflown={false}
                        >
                            <ItemList itemComponent={this.props.itemComponent} items={itemsByGroup}/>
                        </ExpansionPanel>
                    )
                ))}
            </ExpansionList>
        );
    }
}

ListAggregatedByGroup.propTypes = {
    itemComponent: PropTypes.any.isRequired,
    itemFilterFunc: PropTypes.func.isRequired,
    items: PropTypes.instanceOf(Map).isRequired,
    groups: PropTypes.instanceOf(Map).isRequired
};

export default connect(
    (state, {itemFilterFunc}) => {
        return {
            items: getItemCollectionByGroupForList(state, getItemIds(state, itemFilterFunc)),
            groups: getGroupCollection(state)
        };
    }
)(ListAggregatedByGroup);
