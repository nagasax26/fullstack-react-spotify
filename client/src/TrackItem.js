import React, { Component } from 'react'
class TrackItem extends Component {
    constructor() {
        super();
        this.getTrackTime = this.getTrackTime.bind(this);
        this.handleClickPlay = this.handleClickPlay.bind(this);

        this.timerId = null;
        this.state = { randomDegree: 0 };
    }
    getTrackTime() {
        let minutes = this.props.pad(Math.floor(this.props.duration_ms / (1000 * 60)));
        let seconds = this.props.pad(Math.floor((this.props.duration_ms % (1000 * 60)) / 100 / 10));
        return { minutes: minutes, seconds: seconds }
    }
    handleClickPlay() {
        this.props.setActiveSong(this.props.id);
    }
    trimLongWord = () => {
        return this.props.name.length > 24 ? this.props.name.substr(0, 21) + '...' : this.props.name;
    }
    checkActivePlayer = () => {
        if (this.props.activeSongId === this.props.id && this.props.nowPlaying)
            return "/sprite.svg#icon-pause2";
        else
            return "/sprite.svg#icon-play3";
    }
    changeColor = () => {
        if (this.props.activeSongId === this.props.id && this.props.nowPlaying) {
            if (!this.timerId) {
                this.timerId = setInterval(this.tick, 500);
            }
        } else {
            clearInterval(this.timerId);
        }
    }
    tick = () => {
        let randomDegree = Math.floor(Math.random() * 361);
        this.setState({ randomDegree: randomDegree });
    }
    componentDidUpdate() {
        this.changeColor();
    }
    render() {
        return (
            <div style={{
                transition: "all .5s cubic-bezier(.17,.67,.83,.67)",
                filter: this.props.activeSongId === this.props.id && this.props.nowPlaying ? `hue-rotate(${this.state.randomDegree}deg)` : `hue-rotate(0deg)`
            }} className="track">
                <div className="track__img-box">
                    <img width="100%" src={this.props.album.images[0].url} alt="" />
                </div>
                <div className="track__artist">{this.props.artists[0].name}</div>
                <div className="track__name">{this.trimLongWord()}</div>
                <div>{this.getTrackTime().minutes}:{this.getTrackTime().seconds}</div>
                <button className="btn" onClick={this.handleClickPlay}>
                    <svg className="btn-icon">
                        <use xlinkHref={this.checkActivePlayer()}>
                            Play
                        </use>
                    </svg>
                </button>
            </div>
        )
    }
}

export default TrackItem;
