import React from 'react';
import PropTypes from 'prop-types';

import Avatar from 'react-md/lib/Avatars/Avatar';

const styles = {
    datePicker: {
        textAlign: 'center',
        padding: '20px 10px',
    },
    pickerIcon: {
        width: '60px',
        height: '60px',
        backgroundColor: '#ff8c00'
    }
};

class DatePickerElement extends React.PureComponent {
    render() {
        return (
            <div style={styles.datePicker}
                onClick={this.props.onClick}>
                <Avatar icon={this.props.icon} style={styles.pickerIcon} iconSized/>
                <div>{this.props.label}</div>
            </div>
        )
    }
}

DatePickerElement.propTypes = {
    label: PropTypes.string.isRequired,
    icon: PropTypes.any.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default DatePickerElement;
