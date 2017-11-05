import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {List as ListModel} from 'Models/List';

import Header from 'Components/Header';
import BackButton from 'Components/buttons/BackButton';

import {redirectToDefaultList} from 'Services/BrowserHistory';

import {selectProductList} from 'Actions/list';

import ListComponent from './ListAggregatedByGroup';

class SecondaryProductListScreen extends React.PureComponent {
    componentWillReceiveProps({list}) {
        if(!list.isNullObject()) {
            this.props.selectList(list);
        }
    }

    render() {
        if (this.props.list.isNullObject()) {
            redirectToDefaultList();

            return null;
        }

        return (
            <div>
                <Header title={this.props.headerTitle} leftLinks={<BackButton/>}/>

                <ListComponent
                    list={this.props.list}
                    itemComponent={this.props.itemComponent}
                    itemFilterFunc={this.props.itemFilterFunc}
                />
            </div>
        )
    }
}

SecondaryProductListScreen.propTypes = {
    list: PropTypes.instanceOf(ListModel).isRequired,
    headerTitle: PropTypes.string.isRequired,
    itemComponent: PropTypes.any.isRequired,
    itemFilterFunc: PropTypes.func.isRequired,

    selectList: PropTypes.func.isRequired,
};

export default connect(
    null,
    (dispatch) => ({
        selectList: (list) => dispatch(selectProductList(list))
    })
)(SecondaryProductListScreen);
