import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

import {List as ListModel} from 'Models/List';

import Sidebar from 'Components/Sidebar';
import Header from 'Components/Header';
import MenuButton from 'Components/buttons/MenuButton';
import Button from 'react-md/lib/Buttons';

import {getList, getFirstList} from 'Reducers/list';

import {fetchItemsForList} from 'Actions/listItem';

import ListComponent from './components/ListAggregatedByGroup';
import DraftItem from './components/DraftItem';

class ProductListScreen extends React.PureComponent {
    constructor(props) {
        super(props);

        props.fetchListItems(props.list);
    }

    componentWillReceiveProps({list}) {
        if (list !== this.props.list) {
            this.props.fetchListItems(list);
        }
    }

    render() {
        return (
            <div>
                <Sidebar/>
                <Header title={this.props.list.getName()} leftLinks={<MenuButton key="void" />}/>

                <ListComponent list={this.props.list} itemComponent={DraftItem}/>

                <div style={{marginTop: '110px'}}></div>

                <Button onTouchTap={() => this.props.showRecommendations(this.props.list)}
                        floating
                        fixed
                        secondary
                        mini
                        style={{
                            bottom: 90
                        }}>
                    help
                </Button>

                <Button onTouchTap={() => this.props.addItem(this.props.list)}
                        floating fixed primary>add</Button>
            </div>
        )
    }
}

ProductListScreen.propTypes = {
    list: PropTypes.instanceOf(ListModel).isRequired,
    fetchListItems: PropTypes.func.isRequired,
    addItem: PropTypes.func.isRequired,
    showRecommendations: PropTypes.func.isRequired,
};

export default withRouter(connect(
    (state, {match}) => {
        const listId = parseInt(match.params.listId) || 0;

        return {
            list: listId ? getList(state, listId) : getFirstList(state)
        };
    },
    (dispatch, {history}) => {
        return {
            fetchListItems: (list) => fetchItemsForList(list)(dispatch),
            addItem: (list) => history.push('/product-list/' + list.getId() + '/item/search'),
            showRecommendations: (list) => history.push('/product-list/' + list.getId() + '/recommendations')
        };
    }
)(ProductListScreen));
