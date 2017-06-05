import React from 'react';
import PropTypes from 'prop-types'
import {withRouter, Link} from 'react-router-dom'
import {connect} from 'react-redux'

import {getTemplate, createItem} from 'Actions/listItem';

import Header from 'Components/Header';
import HeaderLink from 'Components/HeaderLink';
import Select from 'Components/form/Select';
import Input from 'Components/form/Input';

class AddItemToList extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            template: props.template
        };

        this.onTemplateFieldChange.bind(this);
    }

    componentWillMount() {
        this.props.getTemplate(this.props.productListId, this.props.translationId);
    }

    shouldComponentUpdate({productListId, translationId}) {
        if (
            this.props.productListId !== productListId
            || this.props.translationId !== translationId
        ) {
            this.props.getTemplate(productListId, translationId);
        }

        return true;
    }

    componentDidUpdate({template}) {
        if (
            Object.keys(this.props.template).length > 0
            && this.props.template !== template
        ) {
            this.setState({template: this.props.template});
        }
    }

    onTemplateFieldChange(field, value) {
        this.setState({
            template: {...this.state.template, [field]: value}
        });
    }

    render() {
        if (Object.keys(this.state.template).length === 0) {
            return <div></div>
        }

        const listId = this.props.productListId;

        // todo move action links to header
        return (
            <div>
                <Header title={"Add item to " + this.props.productListName}/>
                <div onClick={this.props.cancelHandler} style={{cursor: 'pointer'}}>Back</div>
                <Link to={"/product-list/" + listId} onClick={() => this.props.saveItemHandler(this.state.template)}>Save</Link>

                <Select label="Group"
                        defaultValue={this.state.template.groupId}
                        options={Object.keys(this.props.groups).map(groupId => {
                            return {
                                value: groupId,
                                label: this.props.groups[groupId].name
                            }
                        })}
                        onChange={(value) => this.onTemplateFieldChange('groupId', value)}/>

                <Select label="Unit"
                        defaultValue={this.state.template.unitId}
                        options={Object.keys(this.props.units).map(unitId => {
                            return {
                                value: unitId,
                                label: this.props.units[unitId].name
                            }
                        })}
                        onChange={(value) => this.onTemplateFieldChange('unitId', value)}/>

                <Input label="Quantity"
                       defaultValue={this.state.template.quantity}
                       onChange={(value) => this.onTemplateFieldChange('quantity', value)}/>
            </div>
        )
    }
}

AddItemToList.propTypes = {
    productListId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    translationId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    productListName: PropTypes.string.isRequired,
    template: PropTypes.shape({
        // id: PropTypes.any,
        // listId: PropTypes.any,
        // productId: PropTypes.any,
        // unitId: PropTypes.any,
        // translationValue: PropTypes.any,
        // unitName: PropTypes.any,
        // groupName: PropTypes.any,
        // status: PropTypes.any
    }).isRequired,
    cancelHandler: PropTypes.func.isRequired,
    saveItemHandler: PropTypes.func.isRequired,
    getTemplate: PropTypes.func.isRequired
};

export default withRouter(connect(
    (state, ownProps) => {
        const {productListId, translationId}= ownProps.match.params;

        const productList = state.storage.list.data[productListId];

        if (!productList) {
            return {
                productListId: 0,
                translationId: 0,
                productListName: 'n/a',
                template: {},
            }
        }

        return {
            productListId,
            translationId,
            productListName: productList.name,
            template: state.storage.listItem.template,
            groups: state.storage.group.items,
            units: state.storage.unit.items,
            translations: state.storage.translation.items,
        }
    },
    (dispatch, {history}) => {
        return {
            cancelHandler: history.goBack,
            saveItemHandler: (template) => createItem(template)(dispatch),
            getTemplate: (listId, translationId) => getTemplate(listId, translationId)(dispatch)

        }
    }
)(AddItemToList));
