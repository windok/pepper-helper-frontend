import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import {getListCollection} from 'Reducers/storage/list';

class ProductListCollection extends React.PureComponent {
    render() {
        const liElements = [];
        this.props.lists.forEach((list) => {
            liElements.push(
                <li key={list.getId()}>
                    <Link to={"/product-list/" + list.getId()}>{list.getName()}</Link>
                </li>
            )
        });

        return (
            <div>
                Lists:
                <ul>{liElements}</ul>
            </div>
        );
    }
}

ProductListCollection.propTypes = {
    lists: PropTypes.instanceOf(Map).isRequired
};

export default connect(
    (state) => {
        return {
            lists: getListCollection(state)
        }
    }
)(ProductListCollection);