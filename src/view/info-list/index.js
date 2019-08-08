import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { List, Dialog, SoftKey } from 'kaid';
import './index.css';

const bloodTypes = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'Hh', 'unknown'];
const organDonorTypes = ['yes', 'no', 'unknown'];

const prefixCls = 'kai-list';

class ListItem extends Component {
  constructor(props) {
    super(props);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onChildrenBlur = this.onChildrenBlur.bind(this);
  }

  onKeyDown(e) {
    const { primary, secondary, onChange } = this.props;

    if (e.key === 'Enter') {
      if (this.children) {
        this.children.focus();
      } else {
        Dialog.prompt({
          content: primary,
          inputOptions: { type: 'text', maxLength: 256, defaultValue: secondary },
          onOK: value => {
            const obj = {};
            obj[primary] = value;
            onChange && onChange(obj);
          }
        });
      }
    }
  }

  onChildrenBlur() {
    this.element.focus();
  }

  render() {
    const { id, primary, secondary, children } = this.props;
    const itemCls = `${prefixCls}-item focusable`;
    const lineCls = `${prefixCls}-line`;
    const primaryCls = `${prefixCls}-primary`;
    const secondaryCls = `${prefixCls}-secondary ${secondary ? '' : 'hidden'}`;

    return (
      <li className={itemCls} tabIndex="-1" id={id} onKeyDown={this.onKeyDown} ref={el => (this.element = el)}>
        <div className={lineCls}>
          <span className={primaryCls} data-l10n-id={primary} />
          <label className={secondaryCls} data-l10n-id={secondary || 'unknown'}>
            {secondary}
          </label>
          {typeof children === 'object'
            ? React.cloneElement(children, {
                ref: el => {
                  this.children = el;
                },
                onBlur: this.onChildrenBlur
              })
            : null}
        </div>
      </li>
    );
  }
}

export default class InfoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      info: props.info
    };
    this.onBloodTypeChange = this.onBloodTypeChange.bind(this);
    this.onOrganDonorChange = this.onOrganDonorChange.bind(this);
    this.updateInfo = this.updateInfo.bind(this);
  }

  componentDidMount() {
    SoftKey.register({ left: '', center: 'select', right: 'options' }, ReactDOM.findDOMNode(this.list));
    this.list.focus();
  }

  onBloodTypeChange(e) {
    const info = { bloodType: e.target.value };
    this.updateInfo(info);
  }

  onOrganDonorChange(e) {
    const info = { organDonor: e.target.value };
    this.updateInfo(info);
  }

  updateInfo(info) {
    this.setState(
      {
        info: { ...this.state.info, ...info }
      },
      () => {
        this.saveInfo(this.state.info);
      }
    );
  }

  saveInfo(info) {
    localStorage.setItem('emergency-info', JSON.stringify(info));
  }

  render() {
    const { name, address, bloodType, allergies, medications, organDonor, notes } = this.state.info;
    return (
      <List
        ref={el => { this.list = el; }}
      >
        <ListItem id="name" primary="name" secondary={name} onChange={this.updateInfo} />
        <ListItem id="address" primary="address" secondary={address} onChange={this.updateInfo} />
        <ListItem id="blood-type" primary="blood-type" secondary={bloodType}>
          <select value={bloodType} onChange={this.onBloodTypeChange}>
            {bloodTypes.map(value => (
              <option value={value} key={value} data-l10n-id={value === 'unknown' ? value : null}>
                {value}
              </option>
            ))}
          </select>
        </ListItem>
        <ListItem id="allergies" primary="allergies" secondary={allergies} onChange={this.updateInfo} />
        <ListItem id="medications" primary="medications" secondary={medications} onChange={this.updateInfo} />
        <ListItem id="organ-donor" primary="organ-donor" secondary={organDonor}>
          <select value={organDonor} onChange={this.onOrganDonorChange}>
            {organDonorTypes.map(value => (
              <option value={value} key={value} data-l10n-id={value}>
                {value}
              </option>
            ))}
          </select>
        </ListItem>
        <ListItem id="notes" primary="notes" secondary={notes} onChange={this.updateInfo} />
      </List>
    );
  }
}
