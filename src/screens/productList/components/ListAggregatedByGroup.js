import React from 'react';
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import {ExpansionList, ExpansionPanel} from 'react-md/lib/ExpansionPanels';
import ItemList from './ItemList';

import {getGroupedItemForList} from 'Reducers/listItem';
import {getGroupCollection} from 'Reducers/group';

class ListAggregatedByGroup extends React.PureComponent {
    render() {
        return (
            <ExpansionList className="product-list-container">
                {Array.from(this.props.items, (([groupId, itemsByGroup]) => (
                        <ExpansionPanel
                            key={groupId}
                            label={this.props.groups.has(groupId) ? this.props.groups.get(groupId).getName() : 'n/a'}
                            secondaryLabel=""
                            defaultExpanded
                        ><ItemList itemComponent={this.props.itemComponent} items={itemsByGroup}/>
                        </ExpansionPanel>
                    )
                ))}
            </ExpansionList>
        );
    }
}

ListAggregatedByGroup.propTypes = {
    itemComponent: PropTypes.any.isRequired,
    items: PropTypes.instanceOf(Map).isRequired,
    groups: PropTypes.instanceOf(Map).isRequired
};

export default connect(
    (state, {list}) => {
        return {
            items: getGroupedItemForList(state, list),
            groups: getGroupCollection(state)
        };
    }
)(ListAggregatedByGroup);
