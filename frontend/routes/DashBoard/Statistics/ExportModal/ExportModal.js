import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import PropTypes from 'prop-types';
import s from './ExportModal.css';
import Calendar from '../Calendar/Calendar';
import FancyTextField from 'common/FancyTextField/FancyTextField';
import formatDate from 'utils/formatDate';
import myFetch from 'utils/fetch';
import downloadCSV from 'utils/downloadCSV';
import jsonToCSV from 'utils/jsonToCSV';

const QUARTER_DATES = {
  1: {
    startDate: 1,
    startMonth: 0,
    endDate: 31,
    endMonth: 2,
  },
  2: {
    startDate: 1,
    startMonth: 3,
    endDate: 30,
    endMonth: 5,
  },
  3: {
    startDate: 1,
    startMonth: 6,
    endDate: 30,
    endMonth: 8,
  },
  4: {
    startDate: 1,
    startMonth: 9,
    endDate: 31,
    endMonth: 11,
  },
};

export default class ExportModal extends Component {
  static propTypes = {
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
  };

  state = {
    startDate: new Date(),
    endDate: new Date(),
    year: new Date().getFullYear(),
    quarter: 0,
  };

  componentDidMount() {
    // Find and set current Quarter
    const date = new Date();
    const quarter = Math.floor(date.getMonth() / 3) + 2;
    this.setQuarter(quarter);
  }

  setQuarter = quarter => {
    this.setState(prevState => {
      const { startDate, endDate, year } = prevState;
      const THIS_QUARTER_DATES = QUARTER_DATES[quarter];

      const newStartDate = new Date(
        year,
        THIS_QUARTER_DATES.startMonth,
        THIS_QUARTER_DATES.startDate,
      );
      const newEndDate = new Date(year, THIS_QUARTER_DATES.endMonth, THIS_QUARTER_DATES.endDate);

      return {
        quarter,
        startDate: newStartDate,
        endDate: newEndDate,
      };
    });
  };

  setYear = event => {
    const target = event.target;
    const year = target.value;

    this.setState(prevState => ({
      year,
      startDate: new Date(prevState.startDate.setFullYear(year)),
      endDate: new Date(prevState.endDate.setFullYear(year)),
    }));
  };

  checkAndSetQuarter = () => {
    this.setState(prevState => {
      const { startDate, endDate } = prevState;
      let newQuarter = 0;
      for (let quarter = 1; quarter <= 4; quarter++) {
        let dates = QUARTER_DATES[quarter];
        if (
          startDate.getDate() === dates.startDate &&
          endDate.getDate() === dates.endDate &&
          startDate.getMonth() === dates.startMonth &&
          endDate.getMonth() === dates.endMonth
        ) {
          newQuarter = quarter;
          break;
        }
      }
      return {
        quarter: newQuarter,
      };
    });
  };

  setStartDate = date => {
    this.setState(
      {
        startDate: date,
      },
      this.checkAndSetQuarter,
    );
  };

  setEndDate = date => {
    this.setState(
      {
        endDate: date,
      },
      this.checkAndSetQuarter,
    );
  };

  render() {
    return (
      <Modal
        show={this.props.show}
        onHide={this.props.onHide}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <div>Export Statistics</div>
        </Modal.Header>
        <Modal.Body>
          <div className={s.flex}>
            From:
            <Calendar setDate={this.setStartDate} date={this.state.startDate} />
          </div>
          <div className={s.flex}>
            Until:
            <Calendar setDate={this.setEndDate} date={this.state.endDate} />
          </div>
          <ButtonToolbar>
            Set Quarter:
            <ToggleButtonGroup
              type="radio"
              name="options"
              defaultValue={1}
              value={this.state.quarter}
              onChange={this.setQuarter}
            >
              <ToggleButton value={1}>Q1</ToggleButton>
              <ToggleButton value={2}>Q2</ToggleButton>
              <ToggleButton value={3}>Q3</ToggleButton>
              <ToggleButton value={4}>Q4</ToggleButton>
            </ToggleButtonGroup>
          </ButtonToolbar>
          <div>
            Set year:
            <FancyTextField
              type="number"
              placeholder="year"
              name="year"
              value={this.state.year}
              onChange={this.setYear}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onHide} variant="secondary">
            Cancel
          </Button>
          <Button variant="success">Download</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
