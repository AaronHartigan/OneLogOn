import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';
import formatDate from 'utils/formatDate';
import s from './TimesTable.css';

const days = ['Sat', 'Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri'];

export default class TimesTable extends Component {
  static propTypes = {
    checkIns: PropTypes.array.isRequired,
    month: PropTypes.number.isRequired,
    year: PropTypes.number.isRequired,
    isLoading: PropTypes.bool.isRequired,
  };

  isWithinBillingPeriod = date => {
    let start = new Date(this.props.year, this.props.month, 25);
    let end = new Date(start.getFullYear(), start.getMonth() + 1, 24);
    return date >= start && date <= end;
  };

  calculateDaysWorked = date => {
    let start = new Date(date);
    let end = new Date(start.getFullYear(), start.getMonth() + 1, 24);

    let days = 0;
    while (start < end) {
      let tomorrow = new Date(start);
      tomorrow.setDate(tomorrow.getDate() + 1);
      let checkInsOnDate = this.props.checkIns.filter(checkIn => {
        let checkInDate = new Date(checkIn.check_in);
        return checkInDate >= start && checkInDate < tomorrow;
      });
      if (checkInsOnDate.length) {
        days++;
      }
      start.setDate(start.getDate() + 1);
    }

    return days;
  };

  calculateHours = (date, missingCheckout) => {
    if (date === undefined) {
      let hours = this.props.checkIns.reduce((sum, checkIn) => {
        if (!checkIn.check_out) {
          return 0;
        }
        return sum + (new Date(checkIn.check_out) - new Date(checkIn.check_in)) / (1000 * 3600);
      }, 0);
      return Math.round(hours * 100) / 100;
    }

    let tomorrow = new Date(date);
    tomorrow.setDate(tomorrow.getDate() + 1);
    let checkInsOnDate = this.props.checkIns.filter(checkIn => {
      let checkInDate = new Date(checkIn.check_in);
      return checkInDate >= date && checkInDate < tomorrow;
    });

    let hours = checkInsOnDate.reduce((sum, checkIn) => {
      if (!checkIn.check_out) {
        missingCheckout.missing = true;
        return 0;
      }
      return sum + (new Date(checkIn.check_out) - new Date(checkIn.check_in)) / (1000 * 3600);
    }, 0);
    return Math.round(hours * 100) / 100;
  };

  createRow = (index, key, date, weeklyTotal) => {
    if (this.isWithinBillingPeriod(date) && (date.getDay() + 1) % 7 === index) {
      let curDate = new Date(date);
      date.setDate(date.getDate() + 1);
      let missingCheckout = { missing: false };
      let hours = this.calculateHours(curDate, missingCheckout);
      weeklyTotal.hours += hours;
      return (
        <tr key={key}>
          <td>{days[index]}</td>
          <td>{formatDate(curDate)}</td>
          <td>
            {hours}
            {missingCheckout.missing ? ' (+)' : ''}
          </td>
        </tr>
      );
    }
    return (
      <tr key={index}>
        <td>{days[index]}</td>
        <td />
        <td />
      </tr>
    );
  };

  render() {
    const { checkIns, isLoading } = this.props;

    if (isLoading) {
      return <div>Loading...</div>;
    }

    let date = new Date(this.props.year, this.props.month, 25);
    let monthTotal = 0;
    let weeklyTotal = { hours: 0 };
    let daysWorked = 0;
    return (
      <React.Fragment>
        <Table striped bordered>
          <tbody>
            <tr>
              <td colSpan="2" className={s.bold}>
                Month Total
              </td>
              <td>{this.calculateHours()} hours</td>
            </tr>
            <tr>
              <td colSpan="2" className={s.bold}>
                Days Worked
              </td>
              <td>{this.calculateDaysWorked(date)} days</td>
            </tr>
          </tbody>
        </Table>
        <div>A (+) indicates that there is a missing sign out on that day.</div>
        <div>Actual hours worked may be higher.</div>
        {Array(6)
          .fill()
          .map((_, index1) => {
            weeklyTotal.hours = 0;
            return (
              <Table striped bordered key={index1}>
                <thead>
                  <tr>
                    <th />
                    <th>Date</th>
                    <th>Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {Array(7)
                    .fill()
                    .map((_, index2) => {
                      if (index1 === 5 && index2 > 1) {
                        return null;
                      }
                      return this.createRow(index2, index1 * 10 + index2, date, weeklyTotal);
                    })}
                  <tr>
                    <td colSpan="2" className={s.bold}>
                      Weekly Total
                    </td>
                    <td>{weeklyTotal.hours}</td>
                  </tr>
                </tbody>
              </Table>
            );
          })}
      </React.Fragment>
    );
  }
}
