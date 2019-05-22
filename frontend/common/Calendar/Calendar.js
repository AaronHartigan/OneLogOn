import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import s from './Calendar.css';
import formatDate from 'utils/formatDate';

const DAY = 'day';
const WEEK = 'week';
const MONTH = 'month';

export default class Calendar extends Component {
  static propTypes = {
    setDate: PropTypes.func.isRequired,
    date: PropTypes.instanceOf(Date).isRequired,
    showSideArrows: PropTypes.bool,
    showTimePeriods: PropTypes.bool,
    timePeriod: PropTypes.string,
  };

  state = {
    timePeriod: this.props.timePeriod || DAY,
    displayCalendar: false,
  };

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  setWrapperRef = node => {
    this.wrapperRef = node;
  };

  setDisplayCalendarRef = node => {
    this.displayCalendarRef = node;
  };

  handleClickOutside = event => {
    if (
      this.wrapperRef &&
      !this.wrapperRef.contains(event.target) &&
      this.displayCalendarRef &&
      !this.displayCalendarRef.contains(event.target)
    ) {
      this.setState({
        displayCalendar: false,
      });
    }
  };

  increaseDate = () => {
    let newDate = this.props.date;
    const { timePeriod } = this.state;
    if (timePeriod === DAY) {
      newDate.setDate(newDate.getDate() + 1);
    } else if (timePeriod === WEEK) {
      let firstOfWeek = newDate.getDate() - newDate.getDay();
      newDate.setDate(firstOfWeek);
      newDate.setDate(newDate.getDate() + 7);
    } else if (timePeriod === MONTH) {
      newDate.setDate(1);
      newDate.setMonth(newDate.getMonth() + 1);
    }
    this.props.setDate(newDate, timePeriod);
  };

  decreaseDate = () => {
    let newDate = this.props.date;
    const { timePeriod } = this.state;
    if (timePeriod === DAY) {
      newDate.setDate(newDate.getDate() - 1);
    } else if (timePeriod === WEEK) {
      let firstOfWeek = newDate.getDate() - newDate.getDay();
      newDate.setDate(firstOfWeek);
      newDate.setDate(newDate.getDate() - 7);
    } else if (timePeriod === MONTH) {
      newDate.setDate(1);
      newDate.setMonth(newDate.getMonth() - 1);
    }
    this.props.setDate(newDate, timePeriod);
  };

  setTimePeriod = timePeriod => {
    const oldTimePeriod = this.state.timePeriod;
    this.setState({
      timePeriod,
    });

    if (oldTimePeriod === timePeriod) {
      return;
    }

    const { date } = this.props;
    this.props.setDate(date, timePeriod);
  };

  goToToday = () => {
    this.props.setDate(new Date(), this.state.timePeriod);
  };

  dayClick = date => {
    this.props.setDate(date, this.state.timePeriod);
  };

  toggleDisplayCalendar = () => {
    this.setState(prevState => ({
      displayCalendar: !prevState.displayCalendar,
    }));
  };

  render() {
    let calendar = this.state.displayCalendar ? (
      <div className={s.calendar} ref={this.setWrapperRef}>
        <DayPicker
          selectedDays={this.props.date}
          month={this.props.date}
          onDayClick={this.dayClick}
          showOutsideDays={this.state.timePeriod === WEEK}
          todayButton="Go to Today"
          onTodayButtonClick={this.goToToday}
        />
      </div>
    ) : null;

    const { timePeriod } = this.state;
    let timePeriods = this.props.showTimePeriods ? (
      <React.Fragment>
        <div className={s.flex}>
          <div
            className={[s.timePeriod, timePeriod === DAY && s.selectedTimePeriod].join(' ')}
            onClick={this.setTimePeriod.bind(this, DAY)}
          >
            Day
          </div>
          <div
            className={[s.timePeriod, timePeriod === WEEK && s.selectedTimePeriod].join(' ')}
            onClick={this.setTimePeriod.bind(this, WEEK)}
          >
            Week
          </div>
          <div
            className={[s.timePeriod, timePeriod === MONTH && s.selectedTimePeriod].join(' ')}
            onClick={this.setTimePeriod.bind(this, MONTH)}
          >
            Month
          </div>
        </div>
        <div className={s.spacer} />
      </React.Fragment>
    ) : null;

    return (
      <div>
        {timePeriods}
        <div className={s.block}>
          <div className={s.flex}>
            {this.props.showSideArrows && (
              <div
                className={[s.calendarSideButton, s.calendarButton].join(' ')}
                onClick={this.decreaseDate}
              >
                ‹
              </div>
            )}
            <div
              className={[
                s.calendarButton,
                s.calendarDate,
                this.state.timePeriod === WEEK ? s.wideCalendarButton : null,
              ].join(' ')}
              onClick={this.toggleDisplayCalendar}
              ref={this.setDisplayCalendarRef}
            >
              {formatDate(this.props.date, this.state.timePeriod)}
            </div>
            {calendar}
            {this.props.showSideArrows && (
              <div
                className={[s.calendarSideButton, s.calendarButton].join(' ')}
                onClick={this.increaseDate}
              >
                ›
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
