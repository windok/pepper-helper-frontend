import React from 'react';
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import Subheader from 'material-ui/Subheader';
import ItemList from './ItemList';

import {getGroupedItemForList} from 'Reducers/storage/listItem';
import {getGroupCollection} from 'Reducers/storage/group';

class ListAggregatedByGroup extends React.PureComponent {
    render() {
        return (
            <div>
                {Array.from(this.props.items, (([groupId, itemsByGroup]) => (
                        <div key={groupId}>
                            <Subheader>
                                {this.props.groups.has(groupId) ? this.props.groups.get(groupId).getName() : 'n/a'}
                            </Subheader>
                            <ItemList itemComponent={this.props.itemComponent} items={itemsByGroup}/>
                        </div>
                    )
                ))}
            </div>
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
