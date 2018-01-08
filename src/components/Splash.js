import React from 'react';

import logo from 'Assets/logo.svg';

const logoElement = <svg xmlns="http://www.w3.org/2000/svg">
    <use xlinkHref={logo.url && '#logo'}/>
</svg>;

class Splash extends React.PureComponent {
    render() {
        return <div className="splash">{logoElement}</div>;
    }
}

export default Splash;

export {
    Splash,
    logoElement
}