import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

import '../styles/Header.css';
import logo from '../assets/logo.svg';

class Header extends Component {
    render() {
        return (
            <header className="Header">
                <nav>
                    <Link to="/">
                        <img src={logo} className="Header__logo" alt="logo" />
                        reMIDI
                    </Link>
                    <Link to="/setup">
                        Setup
                    </Link>
                    <Link to="/play">
                        Play
                    </Link>
                </nav>
            </header>
        );
    }
}

export default withRouter(Header);
