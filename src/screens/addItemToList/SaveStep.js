import React from 'react';
import PropTypes from 'prop-types'
import {withRouter, Link} from 'react-router-dom'
import {connect} from 'react-redux'

import {getTemplate, createItem} from 'Actions/listItem';

import List from 'Models/List';

import Header from 'Components/Header';
import HeaderLink from 'Components/HeaderLink';
import Input from 'Components/form/Input';

import UnitSelect from './components/UnitSelect';
import GroupSelect from './components/GroupSelect';

class AddItemToListSaveStep extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            template: {...props.template}
        };

        this.onTemplateFieldChange.bind(this);
    }

    componentWillMount() {
        this.props.getTemplate(this.props.productList, this.props.translation);
    }

    shouldComponentUpdate({productListId, translationId}) {
        if (this.props.productListId !== productListId || this.props.translationId !== translationId) {
            this.props.getTemplate(productListId, translationId);
        }

        return true;
    }

    componentDidUpdate({template}) {
        if (
            this.props.template
            && this.props.template.translationId !== template.translationId
            && this.props.template.listId !== template.listId
        ) {
            this.setState({template: {...this.props.template}});
        }
    }

    onTemplateFieldChange(field, value) {
        this.setState({
            template: {...this.state.template, [field]: value}
        });
    }

    render() {
        if (!this.state.template) {
            return <div></div>
        }

        // todo move action links to header
        return (
            <div>
                <Header title={"Add item to " + this.props.productListName}/>
                <div onClick={this.props.cancelHandler} style={{cursor: 'pointer'}}>Back</div>
                <Link to={"/product-list/" + this.props.productListId}
                      onClick={() => this.props.saveItemHandler(this.state.template)}>Save</Link>

                <GroupSelect groupId={this.state.template.groupId}
                             onGroupChange={(groupId) => this.onTemplateFieldChange('groupId', groupId)}/>

                <UnitSelect unitId={this.state.template.unitId}
                            onUnitChange={(unitId) => this.onTemplateFieldChange('unitId', unitId)}/>

                <Input label="Quantity"
                       defaultValue={this.state.template.quantity}
                       onChange={(value) => this.onTemplateFieldChange('quantity', value)}/>
            </div>
        )
    }
}

AddItemToListSaveStep.propTypes = {
    productListId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    translationId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    template: PropTypes.object.isRequired,
    productList: PropTypes.instanceOf(List).isRequired,
    translation: PropTypes.object.isRequired,
    cancelHandler: PropTypes.func.isRequired,
    saveItemHandler: PropTypes.func.isRequired,
    getTemplate: PropTypes.func.isRequired
};

export default withRouter(connect(
    (state, {match}) => {
        const {productListId, translationId}= match.params;

        const productList = state.storage.list.items.get(productListId);
        const translation = state.storage.product.items[translationId];

        if (!productList || !translation) {
            return {
                productListId: 0,
                translationId: 0,
                productList: null,
                translation: null,
                template: null,
            }
        }

        return {
            productListId,
            translationId,
            productList,
            translation,
            template: state.storage.listItem.template,
        }
    },
    (dispatch, {history}) => {
        return {
            cancelHandler: history.goBack,
            saveItemHandler: (template) => createItem(template)(dispatch),
            getTemplate: (list, translation) => getTemplate(list, translation)(dispatch)
        }
    }
)(AddItemToListSaveStep));
