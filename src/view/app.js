import React, { Component } from 'react';
import { Header, SoftKey } from 'kaid';
import InfoList from './info-list';

import 'kaid/lib/style.css';
import './app.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.initInfo();
  }

  initInfo = () => {
    const savedInfo = localStorage.getItem('emergency-info');
    if (savedInfo) {
      this.info = JSON.parse(savedInfo);
    } else {
      this.info = {
        name: '',
        address: '',
        bloodType: 'unknown',
        allergies: '',
        medications: '',
        organDonor: 'unknown',
        notes: ''
      };
    }
  };

  render() {
    return (
      <>
        <Header text="emergency-info" />
        <InfoList info={this.info} />
        <SoftKey center="select" right="options" />
      </>
    );
  }
}

export default App;
