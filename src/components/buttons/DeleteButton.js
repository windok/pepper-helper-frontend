import React from 'react';
import PropTypes from 'prop-types';

import Button from 'react-md/lib/Buttons';
import FontIcon from 'react-md/lib/FontIcons';
import DialogContainer from 'react-md/lib/Dialogs';

class DeleteButton extends React.PureComponent {
    constructor(params) {
        super(params);

        this.state = {showDialog: false};
    }

    showDialog = () => {
        this.setState({showDialog: true});
    };

    hideDialog = () => {
        this.setState({showDialog: false});
    };

    render() {
        const actions = [
            {secondary: true, children: 'Cancel', onClick: this.hideDialog},
            <Button flat primary onClick={() => {
                this.props.onClick();
                this.hideDialog();
            }}>Confirm</Button>
        ];

        return (
            <div>
                <div className="md-grid">
                    <Button
                        raised
                        secondary
                        iconBefore={false}
                        iconEl={<FontIcon>delete</FontIcon>}
                        onClick={this.showDialog}
                        className="md-cell--right"
                    >{this.props.text}</Button>
                </div>

                <DialogContainer
                    id="delete-dialog"
                    visible={this.state.showDialog}
                    onHide={this.hideDialog}
                    actions={actions}
                    title="Are you sure to delete?"
                />
            </div>
        );
    }
}

DeleteButton.defaultProps = {
    text: 'Delete'
};

DeleteButton.propTypes = {
    text: PropTypes.string,
    onClick: PropTypes.func.isRequired,
};

export default DeleteButton;