import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import Layout from 'common/Layout/Layout';
import FullScreenLayout from 'common/FullScreenLayout/FullScreenLayout';
import MainFormLayout from 'common/MainFormLayout/MainFormLayout';
import FancyButton from 'common/FancyButton/FancyButton';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import FancyTextField from 'common/FancyTextField/FancyTextField';
import FancyFormHeader from 'common/FancyFormHeader/FancyFormHeader';
import s from './Login.css';
import myFetch from 'utils/fetch';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { login } from 'actions';

class Login extends Component {
  static propTypes = {
    login: PropTypes.func.isRequired,
  };

  state = {
    username: '',
    password: '',
    error: null,
    isLoading: false,
  };

  handleChange = event => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  };

  handleSubmit = async event => {
    event.preventDefault();

    try {
      this.setState({ isLoading: true, error: null });

      const data = await myFetch('/api/login', {
        method: 'POST',
        body: {
          username: this.state.username,
          password: this.state.password,
        },
      });

      this.props.login(data);
      this.props.history.push('/dashboard');
    } catch (err) {
      this.setState({
        error: err.message,
        isLoading: false,
      });
    }
  };

  render() {
    const { error, isLoading, username, password } = this.state;
    let errorMessage = null;
    if (error) {
      errorMessage = <Alert variant="danger">{error}</Alert>;
    }

    return (
      <Layout>
        <FullScreenLayout>
          <Form className={s.form} noValidate onSubmit={this.handleSubmit}>
            {errorMessage}
            <MainFormLayout>
              <FancyFormHeader text="Login" />
              <Form.Group>
                <Form.Label className={s.label}>Username</Form.Label>
                <FancyTextField
                  autoFocus
                  required
                  autoComplete="username"
                  type="text"
                  placeholder="Username"
                  name="username"
                  onChange={this.handleChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label className={s.label}>Password</Form.Label>
                <FancyTextField
                  required
                  autoComplete="current-password"
                  type="password"
                  placeholder="Password"
                  name="password"
                  onChange={this.handleChange}
                />
              </Form.Group>
              <div>
                <FancyButton label="Log in" loading={isLoading ? 1 : 0} type="submit" />
              </div>
              <div className={s.redirectLink}>
                <Link to="/register">Create an account</Link>
              </div>
            </MainFormLayout>
          </Form>
        </FullScreenLayout>
      </Layout>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    login: data => dispatch(login(data)),
  };
};

export default withRouter(
  connect(
    null,
    mapDispatchToProps,
  )(Login),
);

// Named unconnected export for testing
export { Login as LoginTest };
