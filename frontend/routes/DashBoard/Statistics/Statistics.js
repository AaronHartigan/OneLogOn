import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import SimpleHeader from 'common/SimpleHeader/SimpleHeader';
import s from './Statistics.css';
import ExportModal from './ExportModal/ExportModal';
import Calendar from 'common/Calendar/Calendar';
import MyTable from './MyTable/MyTable';
import fetchVisitors from './fetchVisitors';
import formatDate from 'utils/formatDate';

const countUniqueVisitors = visitors => {
  return new Set(visitors.map(visitor => visitor.visitor_id)).size;
};

const calculateAverageDuration = visitors => {
  let count = 0;
  let minutes = 0;
  visitors.forEach(visitor => {
    if (!visitor.check_out || !visitor.check_in) {
      return 'continue';
    }
    count += 1;
    let visitTime = new Date(visitor.check_out) - new Date(visitor.check_in);
    minutes += visitTime / (60 * 1000);
  });
  if (count === 0) {
    return 0;
  }
  return Math.round(minutes / count);
};

const calculateTotalDuration = visitors => {
  let minutes = 0;
  visitors.forEach(visitor => {
    if (!visitor.check_out || !visitor.check_in) {
      return 'continue';
    }
    let visitTime = new Date(visitor.check_out) - new Date(visitor.check_in);
    minutes += visitTime / (60 * 1000);
  });
  return Math.round(minutes);
};

const formatTime = minutes => {
  if (minutes > 60) {
    let modMinutes = minutes % 60;
    return `${Math.floor(minutes / 60)}.${Math.round(modMinutes / 60)} hours`;
  }
  return `${minutes} minutes`;
};

export default class Statistics extends Component {
  state = {
    visitors: [],
    selectedDate: new Date(),
    showExportModal: false,
    timePeriod: 'day',
    isLoading: false,
    error: null,
  };

  componentDidMount = async () => {
    const visitors = await this.getVisitors(new Date());
    this.setState({
      visitors: visitors || [],
    });
  };

  setDate = async (date, timePeriod = 'day') => {
    const visitors = await this.getVisitors(date, timePeriod);
    this.setState({
      selectedDate: date,
      visitors: visitors || [],
      timePeriod,
    });
  };

  getVisitors = async (date, timePeriod) => {
    try {
      this.setState({ isLoading: true, error: null });
      let curDate = new Date(date);
      let nextDate = new Date(date);
      if (timePeriod === 'day') {
        nextDate.setDate(date.getDate() + 1);
      } else if (timePeriod === 'week') {
        let firstOfWeek = curDate.getDate() - curDate.getDay();
        curDate.setDate(firstOfWeek);
        nextDate.setMonth(curDate.getMonth());
        nextDate.setDate(curDate.getDate() + 7);
      } else if (timePeriod === 'month') {
        curDate.setDate(1);
        nextDate.setDate(1);
        nextDate.setMonth(nextDate.getMonth() + 1);
      }

      const visitor_data = await fetchVisitors(curDate, nextDate);
      this.setState({
        isLoading: false,
      });
      return visitor_data;
    } catch (err) {
      this.setState({
        isLoading: false,
        error: err.message,
      });
    }
  };

  showExportModal = () => {
    this.setState({
      showExportModal: true,
    });
  };

  hideExportModal = () => {
    this.setState({
      showExportModal: false,
    });
  };

  render() {
    const { selectedDate, timePeriod } = this.state;

    let statistics;
    if (this.state.error) {
      statistics = <div className={s.largeMessage}>{this.state.error}</div>;
    } else if (this.state.isLoading) {
      statistics = <div className={s.largeMessage}>Loading...</div>;
    } else if (this.state.visitors.length) {
      statistics = (
        <React.Fragment>
          <div className={s.statisticContainer}>
            <div className={s.statistic}>
              <div className={s.description}>Unique Visitors</div>
              <div className={s.number}>{countUniqueVisitors(this.state.visitors)}</div>
            </div>
            <div className={s.statistic}>
              <div className={s.description}>Total Visits</div>
              <div className={s.number}>{this.state.visitors.length}</div>
            </div>
            <div className={s.statistic}>
              <div className={s.description}>Avg Duration</div>
              <div className={s.number}>
                {formatTime(calculateAverageDuration(this.state.visitors))}
              </div>
            </div>
            <div className={s.statistic}>
              <div className={s.description}>Total Duration</div>
              <div className={s.number}>
                {formatTime(calculateTotalDuration(this.state.visitors))}
              </div>
            </div>
          </div>
          {timePeriod === 'day' && <MyTable visitors={this.state.visitors} />}
        </React.Fragment>
      );
    } else {
      let emptyMessage = 'No visitors during ' + formatDate(selectedDate, timePeriod) + '.';
      statistics = <div className={s.largeMessage}>{emptyMessage}</div>;
    }
    return (
      <React.Fragment>
        <SimpleHeader title="Statistics" />
        <div className={s.root}>
          <div className={s.flex}>
            <Calendar
              setDate={this.setDate}
              date={this.state.selectedDate}
              showSideArrows
              showTimePeriods
            />
            <Button className={s.right} onClick={this.showExportModal} variant="success">
              Export
            </Button>
            <ExportModal show={this.state.showExportModal} onHide={this.hideExportModal} />
          </div>
          {statistics}
        </div>
      </React.Fragment>
    );
  }
}
