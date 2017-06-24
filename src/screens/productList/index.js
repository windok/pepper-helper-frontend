import React from 'react';
import PropTypes from 'prop-types'
import {withRouter, Link} from 'react-router-dom'
import {connect} from 'react-redux'

import {List as ListModel, ListNullObject} from 'Models/List';

import Sidebar from 'Components/Sidebar';
import Header from 'Components/Header';
import HeaderLink from 'Components/HeaderLink';
import MenuButton from 'Components/buttons/MenuButton';

import {getList, getFirstList} from 'Reducers/storage/list';

import {fetchItemsForList} from 'Actions/listItem';

import ListComponent from './components/List';

class ProductList extends React.PureComponent {
    componentWillMount() {
        this.props.fetchListItems(this.props.list);
    }

    shouldComponentUpdate({list}) {
        if (list.getId() === this.props.list.getId()) {
            return false;
        }

        this.props.fetchListItems(list);

        return true;
    }

    render() {
        // todo create separate component that specifies Menu
        // todo keep list of links for each screen somewhere

        if (this.props.list.isNullObject()) {
            return (
                <div>
                    <Sidebar/>
                    <Header title={"Product list " + this.props.list.getName()} leftLinks={<MenuButton/>}/>
                    {this.props.list.getName()}
                </div>
            );
        }

        // todo add item and recommendation links should be FAB
        return (
            <div>
                <Sidebar/>
                <Header title={"Product list " + this.props.list.getName()} leftLinks={<MenuButton/>}/>

                <ListComponent list={this.props.list}/>
                <br/>
                <Link to={"/product-list/" + this.props.list.getId() + "/recommendations"}>Show recommendations</Link>
                <br/>
                <Link to={"/product-list/" + this.props.list.getId() + "/add-item/search"}>Add item</Link>
            </div>
        )
    }
}

ProductList.propTypes = {
    listId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    list: PropTypes.instanceOf(ListModel).isRequired,
    fetchListItems: PropTypes.func.isRequired,
};

export default withRouter(connect(
    (state, {match}) => {
        const listId = parseInt(match.params.listId) || 0;

        const list = listId ? getList(state, listId) : getFirstList(state);

        if (
            // todo list fetching request in progress
            // todo maybe this list does not exist?
            // todo unexisted list, redirect to user's default list
            list.isNullObject()
        ) {
            return {listId: 0, list};
        }

        return {listId, list};
    },
    (dispatch) => {
        return {
            fetchListItems: (list) => fetchItemsForList(list)(dispatch)
        };
    }
)(ProductList));
