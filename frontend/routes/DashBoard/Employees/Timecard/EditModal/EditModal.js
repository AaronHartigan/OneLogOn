import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert, Modal, Button, InputGroup } from 'react-bootstrap';
import TimesTable from '../../TimesTable/TimesTable';
import Calendar from 'common/Calendar/Calendar';
import FancyTextField from 'common/FancyTextField/FancyTextField';
import s from './EditModal.css';
import myFetch from 'utils/fetch';

export default class EditModal extends Component {
  static propTypes = {
    employee: PropTypes.object.isRequired,
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
  };

  state = {
    data: [],
    selectedDate: new Date(),
    error: null,
    isLoading: false,
  };

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.show === false && this.props.show === true) {
      this.updateTimecard();
    }
  }

  updateTimecard = async () => {
    try {
      this.setState({
        error: null,
        isLoading: true,
      });
      const { selectedDate } = this.state;
      const data = await myFetch(
        `/api/employee/${this.props.employee.id}/timecard/${selectedDate.getMonth() +
          1}/${selectedDate.getFullYear()}`,
      );

      this.setState({
        data,
        isLoading: false,
      });
    } catch (err) {
      this.setState({
        isLoading: false,
        error: err.message,
      });
    }
  };

  handleChange = event => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      error: null,
      [name]: value,
    });
  };

  setDate = async date => {
    this.setState({
      selectedDate: date,
    });
    this.updateTimecard();
  };

  render() {
    const { error, isLoading, selectedDate } = this.state;
    const { onHide } = this.props;

    let errorMessage = null;
    if (error) {
      errorMessage = <Alert variant="danger">{error}</Alert>;
    }
    let submitButton = null;

    return (
      <Modal
        show={this.props.show}
        onHide={this.props.onHide}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <div className={s.flex}>
            <div className={s.name}>
              Time Card: {this.props.employee.first_name} {this.props.employee.last_name}
            </div>
            <Calendar
              className={s.calendar}
              setDate={this.setDate}
              date={selectedDate}
              showSideArrows
              timePeriod={'month'}
            />
          </div>
        </Modal.Header>
        {errorMessage}
        <Modal.Body>
          <TimesTable
            checkIns={this.state.data}
            month={this.state.selectedDate.getMonth()}
            year={this.state.selectedDate.getFullYear()}
            isLoading={isLoading}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onHide} variant="secondary">
            Close
          </Button>
          {submitButton}
        </Modal.Footer>
      </Modal>
    );
  }
}
