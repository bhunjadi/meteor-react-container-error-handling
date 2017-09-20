import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer, withTracker } from 'meteor/react-meteor-data';
import { ReactiveVar } from 'meteor/reactive-var';

import { Tasks } from '../api/tasks.js';
import Task from './Task.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';

const error = new ReactiveVar(null);

// Clear error on login, to potentially represent the data (if user has adequate permissions).
Accounts.onLogin(function() {
    error.set(null);
});

export class App extends Component {

    renderTasks() {
        return this.props.tasks.map((task) => (
            <Task key={task._id} task={task} />
        ));
    }

    render() {
         let content;
        const e = error.get();
        if (e) {
            content = (<div>Sorry, mate. You just got errored. {e.message}</div>)
        }
        else if (this.props.loading) {
            content = (<div>Loading...</div>);
        }
        else if (this.props.currentUser) {
            content = (<ul>
                {this.renderTasks()}
            </ul>)
        }
        else {
            content = <div>You have to sign in to view the tasks.</div>
        }

        return (
            <div className="container">
                <header>
                    <h1>Todo List</h1>

                    <AccountsUIWrapper />
                </header>

                {content}
            </div>
        );
    }
}

App.propTypes = {
    tasks: PropTypes.array.isRequired,
    loading: PropTypes.bool,
    error: PropTypes.object
};

export default withTracker((props) => {
    let taskHandle = null;

    // Only fetch data if there is no error
    // If we would load taskHandle on every error it would end up in infinite loop
    if (!error.get()) {
        taskHandle = Meteor.subscribe('tasks', {
            onError: function (err) {
                if (err) {
                    error.set(err);
                }
            }
        });
    }

    return {
        error: error.get(),
        loading: taskHandle ? !taskHandle.ready() : false,
        tasks: taskHandle ? Tasks.find({}, {sort: {createdAt: -1}}).fetch() : [],
        currentUser: Meteor.user()
    }
})(App);
