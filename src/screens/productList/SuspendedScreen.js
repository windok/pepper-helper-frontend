import moment from 'moment';

import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

import {List as ListModel} from 'Models/List';
import {STATUS_DRAFT, TYPE_GENERAL} from 'Models/ListItem';

import {getList} from 'Reducers/list';

import SuspendedItem from "./components/SuspendedItem";
import SecondaryProductListScreen from "./components/SecondaryProductListScreen";

class SuspendedScreen extends React.PureComponent {
    render() {
        return (
            <SecondaryProductListScreen
                list={this.props.list}
                headerTitle={this.props.list.getName() + ': Snoozed'}
                itemComponent={SuspendedItem}
                itemFilterFunc={(item) => {
                    const today = moment.utc();
                    const nextDay = moment.utc(today.add(1, 'day').format('YYYY-MM-DD'), 'YYYY-MM-DD');
                    const isItemActual = item.getDate().isAfter(nextDay);

                    return item.getListId() === this.props.list.getIdentifier()
                        && item.getStatus() === STATUS_DRAFT
                        && item.getType() === TYPE_GENERAL
                        && isItemActual
                }}
            />
        )
    }
}

SuspendedScreen.propTypes = {
    list: PropTypes.instanceOf(ListModel).isRequired,
};

export default withRouter(connect(
    (state, {match}) => ({
        list: getList(state, match.params.listId)
    })
)(SuspendedScreen));
