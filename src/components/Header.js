import React from 'react';
import PropTypes from 'prop-types';
import ToolBar from 'react-md/lib/Toolbars';
import MenuButton from 'react-md/lib/Menus/MenuButton';

class Header extends React.PureComponent {
    render() {
        let actions = this.props.rightLinks && this.props.rightLinks.constructor.name === 'Array'
            ? this.props.rightLinks
            : [this.props.rightLinks];

        if (this.props.options.length) {
            actions.push((
                <MenuButton icon key='options' buttonChildren="more_vert">
                    {this.props.options}
                </MenuButton>
            ));
        }

        return (
            <ToolBar title={this.props.title}
                     colored
                     nav={this.props.leftLinks}
                     actions={actions}
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
    leftLinks: PropTypes.element.isRequired,
    rightLinks: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element]).isRequired,
    options: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element]).isRequired,
};

export default Header;

