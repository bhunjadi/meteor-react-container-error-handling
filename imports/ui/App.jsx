import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { ReactiveVar } from 'meteor/reactive-var';

import { Tasks } from '../api/tasks.js';
import Task from './Task.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';

let error = new ReactiveVar(null);

// App component - represents the whole app
class App extends Component {

    constructor(props) {
        super(props);
        console.log('setting state?');
        this.state = {error: error};
    }

    renderTasks() {
        return this.props.tasks.map((task) => (
            <Task key={task._id} task={task} />
        ));
    }

    render() {
        var e = this.state.error.get();
        if (e) {
            return (<div>Sorry, mate. You just got errored. {e.message}</div>)
        }

        if (this.props.loading) {
            return (<div>Loading...</div>);
        }

        return (
            <div className="container">
                <header>
                    <h1>Todo List</h1>

                    <AccountsUIWrapper />
                </header>

                {this.props.currentUser ?
                    <ul>
                        {this.renderTasks()}
                    </ul> :
                    <div>You have to sign in to view the tasks.</div>}
            </div>
        );
    }
}

App.propTypes = {
    tasks: PropTypes.array.isRequired,
    loading: PropTypes.bool,
    error: PropTypes.object
};

export default createContainer((props) => {
    const taskHandle = Meteor.subscribe('tasks', {
        onError: function(err) {
            if (err) {
                error.set(err);
            }
        }
    });

    return {
        loading: !taskHandle.ready(),
        tasks: Tasks.find({}, {sort: {createdAt: -1}}).fetch(),
        currentUser: Meteor.user()
    }
}, App);
