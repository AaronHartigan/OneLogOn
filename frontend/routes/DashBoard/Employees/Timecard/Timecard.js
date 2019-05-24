import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import EditModal from './EditModal/EditModal';
import PropTypes from 'prop-types';
import s from './Timecard.css';

export default class Timecard extends Component {
  static propTypes = {
    employee: PropTypes.object.isRequired,
  };

  state = {
    showModal: false,
    error: false,
  };

  showModal = () => {
    this.setState({
      showModal: true,
    });
  };

  hideModal = () => {
    this.setState({
      showModal: false,
    });
  };

  updateEmployee = employee => {};

  handleClick = () => {
    this.setState({
      showModal: true,
    });
  };

  render() {
    return (
      <div>
        <EditModal
          employee={this.props.employee}
          show={this.state.showModal}
          onHide={this.hideModal}
        />
        <Button size="sm" onClick={this.handleClick} className={s.button}>
          View
        </Button>
      </div>
    );
  }
}
