import moment from 'moment';

import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

import {List as ListModel} from 'Models/List';
import {STATUS_BOUGHT, TYPE_GENERAL} from 'Models/ListItem';

import {getList} from 'Reducers/list';

import BoughtItem from "./components/BoughtItem";
import SecondaryProductListScreen from "./components/SecondaryProductListScreen";

class BoughtScreen extends React.PureComponent {
    render() {
        const today = moment.utc();
        const boughtSince = today.subtract(2, 'day');

        return (
            <SecondaryProductListScreen
                list={this.props.list}
                headerTitle={this.props.list.getName() + ': Bought'}
                itemComponent={BoughtItem}
                itemFilterFunc={item => {
                    return item.getListId() === this.props.list.getIdentifier()
                        && item.getStatus() === STATUS_BOUGHT
                        && item.getType() === TYPE_GENERAL
                        && item.getDate().isAfter(boughtSince)
                }}
            />
        )
    }
}

BoughtScreen.propTypes = {
    list: PropTypes.instanceOf(ListModel).isRequired
};

export default withRouter(connect(
    (state, {match}) => ({
        list: getList(state, match.params.listId)
    }),
)(BoughtScreen));
