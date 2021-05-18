import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Search from './Search';
import Player from './Player';

class Header extends Component {
    render() {
        const h = this.props.history.location.pathname
        return (
            <header className="nav-bar">
                <div className="icon-logo-box">
                    <div className="logo-box">
                        <svg className="logo">
                            <use xlinkHref="/sp-spotify.svg#icon-spotify"></use>
                        </svg>
                    </div>
                    <span className="icon-logo-name">Spotify</span>
                </div>
                <div>
                    <a className="login-button" href='https://react-spotify-design.herokuapp.com/login'>LOGIN</a>
                </div>
                <Search
                    apiUrl={this.props.apiUrl}
                    token={this.props.token}
                    auth={this.props.auth}
                    setTrackList={this.props.setTrackList} />
                <ul className="nav-bar__nav" >
                    <li className={`nav-bar__item ${ h === '/' && 'nav-bar__item--active'}`}><Link className="nav-bar__link" to="/">Home</Link></li>
                    <li className={`nav-bar__item ${ h === '/albums' && 'nav-bar__item--active'}`}><Link className="nav-bar__link" to="/albums">Albums</Link></li>
                </ul>
                <div className="nav-bar__divider"></div>
                {this.props.showPlayer &&
                    <Player setNowPlaying={this.props.setNowPlaying} pad={this.props.pad} autoPlay={this.props.autoPlay}
                        setNextTrack={this.props.setNextTrack}
                        setPreviousTrack={this.props.setPreviousTrack}
                        activeSong={this.props.activeSong} />
                }
            </header>
        );
    }
}

export default withRouter(Header)