import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {List as ListModel} from 'Models/List';

import {ensureListExists} from 'Components/EnsureListExists';
import Header from 'Components/Header';
import BackButton from 'Components/buttons/BackButton';

import {selectProductList} from 'Actions/list';

import ListComponent from './ListAggregatedByGroup';

class SecondaryProductListScreen extends React.PureComponent {
    render() {
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

    selectList() {
        if(this.props.list && !this.props.list.isNullObject()) {
            this.props.selectList(this.props.list);
        }
    }

    componentDidMount() {
        this.selectList();
    }

    componentDidUpdate() {
        this.selectList();
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
)(ensureListExists(SecondaryProductListScreen));
