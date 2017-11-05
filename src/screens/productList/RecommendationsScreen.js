import moment from 'moment';

import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

import {List as ListModel} from 'Models/List';
import {TYPE_RECOMMENDED} from 'Models/ListItem';

import {getList} from 'Reducers/list';

import RecommendedItem from './components/RecommendedItem';
import SecondaryProductListScreen from "./components/SecondaryProductListScreen";

class RecommendationsScreen extends React.PureComponent {
    render() {
        return (
            <SecondaryProductListScreen
                list={this.props.list}
                headerTitle={this.props.list.getName() + ': Recommendations'}
                itemComponent={RecommendedItem}
                itemFilterFunc={(item) => {
                    const today = moment.utc();
                    const nextDay = moment.utc(today.add(1, 'day').format('YYYY-MM-DD'), 'YYYY-MM-DD');
                    const isItemActual = nextDay.isAfter(item.getDate());

                    return item.getListId() === this.props.list.getIdentifier()
                        && item.getType() === TYPE_RECOMMENDED
                        && isItemActual
                }}
            />
        )
    }
}

RecommendationsScreen.propTypes = {
    list: PropTypes.instanceOf(ListModel).isRequired
};

export default withRouter(connect(
    (state, {match}) => ({
        list: getList(state, match.params.listId)
    })
)(RecommendationsScreen));
