import React from 'react';
import PropTypes from 'prop-types';
import AppBar from 'material-ui/AppBar';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

class Header extends React.PureComponent {
    render() {
        let rightLinks = this.props.rightLinks;

        if (this.props.options.length && rightLinks.constructor.name === 'Array') {
            rightLinks.push((
                <IconMenu key='options' iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}>
                    {this.props.options}
                </IconMenu>
            ));
        }

        const leftLinks = this.props.leftLinks.constructor.name === 'Array'
            ? (<div>{this.props.leftLinks}</div>)
            : this.props.leftLinks;

        rightLinks = this.props.rightLinks.constructor.name === 'Array'
            ? (<div>{this.props.rightLinks}</div>)
            : this.props.rightLinks;

        return (
            <AppBar title={this.props.title}
                    iconElementLeft={leftLinks}
                    iconElementRight={rightLinks}
            />
        );
    }
}


Header.defaultProps = {
    leftLinks: [],
    rightLinks: [],
    options: []
};

Header.propTypes = {
    title: PropTypes.string.isRequired,
    leftLinks: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element]).isRequired,
    rightLinks: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element]).isRequired,
    options: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element]).isRequired,
};

export default Header;

