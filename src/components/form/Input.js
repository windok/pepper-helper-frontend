import React from 'react';
import PropTypes from 'prop-types'

class Input extends React.PureComponent {
    render() {
        return (
            <div>
                <label>{this.props.label}:
                    <input type={this.props.type}
                           value={this.props.defaultValue}
                           onChange={(event) => this.props.onChange(event.target.value)}/>
                </label>
            </div>
        )
    }
}

Input.defaultProps = {
    type: 'text',
    defaultValue: '',
    onChange: PropTypes.func.isRequired
};


Input.propTypes = {
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.oneOf(['text', 'password']).isRequired,
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onChange: PropTypes.func.isRequired
};

export default Input;