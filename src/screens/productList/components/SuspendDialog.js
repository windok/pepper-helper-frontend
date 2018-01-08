import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import moment from 'moment';

import {ListItem as ListItemModel} from 'Models/ListItem';

import Button from 'react-md/lib/Buttons/Button';
import DialogContainer from 'react-md/lib/Dialogs/DialogContainer';
import Toolbar from 'react-md/lib/Toolbars/Toolbar';
import FontIcon from 'react-md/lib/FontIcons';
import SVGIcon from 'react-md/lib/SVGIcons';
import DatePicker from 'react-md/lib/Pickers/DatePickerContainer';

import DatePickerElement from './DatePickerElement';

import {suspendItem} from 'Actions/listItem';

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%'
    },
    centerAlignRow: {
        display: 'flex',
        justifyContent: 'center',
    },
};

class SuspendDialog extends React.PureComponent {
    state = {
        datePickerVisible: false
    };

    suspendItem = date => {
        this.props.suspendItem(date);
        this.props.hideDialog();
    };

    showDatePicker = () => this.setState({datePickerVisible: true});

    handleDatePickerVisibilityChange = (datePickerVisible) => {
        this.state.datePickerVisible !== datePickerVisible && this.setState({datePickerVisible});
    };

    render() {
        return (
            <DialogContainer
                id="simple-full-page-dialog"
                visible={this.props.visible}
                fullPage
                onHide={this.props.hideDialog}
                aria-labelledby="simple-full-page-dialog-title"
            >
                <Toolbar
                    fixed
                    colored
                    title="Snooze"
                    titleId="simple-full-page-dialog-title"
                    nav={<Button icon onClick={this.props.hideDialog}>close</Button>}
                />

                <div style={styles.container}>

                    <div style={styles.centerAlignRow}>
                        <DatePickerElement
                            label="Smart reschedule"
                            icon={<SVGIcon use="#svglogo" style={{fill: 'white'}}/>}
                            onClick={() => {
                            }}/>
                    </div>

                    <div style={styles.centerAlignRow}>
                        <DatePickerElement
                            label="Today"
                            icon={<FontIcon>today</FontIcon>}
                            onClick={() => this.suspendItem(moment.utc())}/>
                        <DatePickerElement
                            label="Tomorrow"
                            icon={<FontIcon>today</FontIcon>}
                            onClick={() => this.suspendItem(moment.utc().add(1, 'days'))}/>
                        <DatePickerElement
                            label="Next week"
                            icon={<FontIcon>today</FontIcon>}
                            onClick={() => this.suspendItem(moment.utc().add(7, 'days'))}/>
                    </div>

                    <div id="snooze-date-picker" style={styles.centerAlignRow}>
                        <DatePickerElement
                            label="Pick date"
                            icon={<FontIcon>edit</FontIcon>}
                            onClick={this.showDatePicker}/>
                        <DatePicker
                            id="md-snooze-date-picker"
                            label=""
                            visible={this.state.datePickerVisible}
                            minDate={moment.utc().subtract(1, 'days').toDate()}
                            defaultValue={moment.utc().toDate()}
                            autoOk={true}
                            onChange={(date) => this.suspendItem(moment(date))}
                            onVisibilityChange={this.handleDatePickerVisibilityChange}
                        />
                    </div>

                </div>

            </DialogContainer>
        )
    }
}

SuspendDialog.propTypes = {
    listItem: PropTypes.instanceOf(ListItemModel).isRequired,
    visible: PropTypes.bool.isRequired,
    hideDialog: PropTypes.func.isRequired,

    suspendItem: PropTypes.func.isRequired
};

export default connect(
    null,
    (dispatch, {listItem}) => ({
        suspendItem: (date) => dispatch(suspendItem(listItem, date))
    })
)(SuspendDialog);
