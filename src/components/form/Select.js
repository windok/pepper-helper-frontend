import React from 'react';
import PropTypes from 'prop-types'

class Select extends React.PureComponent {
    render() {
        return (
            <div>
                <label>{this.props.label}:
                    <select value={this.props.defaultValue}
                            onChange={(event) => this.props.onChange(event.target.value)}>
                        {this.props.options.map((option) => {
                            return <option key={option.value} value={option.value}>{option.label}</option>
                        })}
                    </select>
                </label>
            </div>
        )
    }
}

Select.propTypes = {
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
    })).isRequired,
    onChange: PropTypes.func.isRequired
};

export default Select;