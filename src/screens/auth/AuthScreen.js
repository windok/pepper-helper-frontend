import React from 'react';
import SignInScreen from './components/SignInScreen';
import RegistrationScreen from './components/RegistrationScreen';
import Button from 'react-md/lib/Buttons';

import {logoElement} from 'Components/Splash';

class AuthScreen extends React.PureComponent {

    state = {
        screen: 'signIn'
    };

    render() {
        const screens = {
            signIn: <SignInScreen/>,
            registration: <RegistrationScreen/>
        };

        return (
            <div>
                <div className="splash auth-splash">
                    {logoElement}
                    <div className={'auth-container ' + this.state.screen}>
                        <div className="screens">
                            <Button
                                flat
                                onClick={() => this.setState({screen: 'signIn'})}
                            >Sign in</Button>
                            <Button
                                flat
                                onClick={() => this.setState({screen: 'registration'})}
                            >Register</Button>
                        </div>
                        <div className="form">
                            {screens[this.state.screen]}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default AuthScreen;
