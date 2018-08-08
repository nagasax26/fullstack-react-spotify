import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import TrackList from './TrackList';
import InfiniteScroll from 'react-infinite-scroller';


class App extends Component {
  constructor() {
    super();

    this.categoryNumber = 0;
    this.playlistNumber = 0;
    this.changeCategory = false;

    this.getCategories = this.getCategories.bind(this);
    this.getCategoriesPlaylist = this.getCategoriesPlaylist.bind(this);
    this.getPlaylistTracks = this.getPlaylistTracks.bind(this);

    this.removeDuplicate = this.removeDuplicate.bind(this);

    this.loadFunc = this.loadFunc.bind(this);
    this.changeActive = true;
    this.isCalledFirstTime = true;
  }

  getCategories() {
    axios.get(`${this.props.apiUrl}/browse/categories`, this.props.auth)
      .then(res => {
        // this need to be flatten 
        // need * to get all ids from all the category..
        if (this.categoryNumber === res.data.categories.items.length)
          return;
        let categoryId;
        if (this.changeCategory)
          categoryId = res.data.categories.items[this.categoryNumber++].id;
        else
          categoryId = res.data.categories.items[this.categoryNumber].id;
        this.getCategoriesPlaylist(categoryId);
      });
  }
  getCategoriesPlaylist(categoryId) {
    axios.get(`${this.props.apiUrl}/browse/categories/${categoryId}/playlists`, this.props.auth)
      .then(res => {
        // the res need to be flatten to display single array
        // need to be mapped to single ids
        if (this.playlistNumber === res.data.playlists.items.length) {
          this.playlistNumber = 0;
          this.changeCategory = true;
          return;
        }
        this.getPlaylistTracks(res.data.playlists.items[this.playlistNumber++].id);
      });
  }
  getPlaylistTracks(playlistId) {
    axios.get(`${this.props.apiUrl}/users/smarts003/playlists/${playlistId}/tracks`, this.props.auth)
      .then(res => {
        let tracksFromProps = this.props.tracks.concat();
        let tracks =
          res.data.items.filter(item => item.track.preview_url)
            .map(item => item.track);
        let combined = this.removeDuplicate([...tracksFromProps, ...tracks]);
        // this.setState({ tracks: combined });

        this.props.setTrackList(combined, this.changeActive);
      });
  }

  componentDidMount() {
    this.getCategories();
  }

  loadFunc() {
    if (this.isCalledFirstTime) {
      this.isCalledFirstTime = false;
      return;
    }
    this.changeActive = false;
    this.getCategories();
  }
  removeDuplicate(arr) {
    let obj = {};
    let arr2 = [];
    for (let i = 0; i < arr.length; i++) {
      if (!obj[arr[i].id]) {
        arr2.push(arr[i]);
        obj[arr[i].id] = true;
      }
    }
    return arr2;
  }
  render() {
    return (
      <div className="App">
        <InfiniteScroll
          useWindow={false}
          pageStart={0}
          loadMore={this.loadFunc}
          hasMore={true || false}
          loader={<div className="loader" key={0}>Loading ...</div>}>
          <TrackList activeSongId={this.props.activeSongId} nowPlaying={this.props.nowPlaying} setActiveSong={this.props.setActiveSong} pad={this.props.pad} tracks={this.props.tracks} />
        </InfiniteScroll>
      </div>
    );
  }
}
export default App;