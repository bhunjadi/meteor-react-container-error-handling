import React, {Component} from 'react';
import PropTypes from 'prop-types';
import container from '/imports/modules/container';

import {Tasks} from '../api/tasks.js';
import Task from './Task.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';

// App component - represents the whole app
class App extends Component {

    constructor(props) {
        super(props);
    }

    renderTasks() {
        return this.props.tasks.map((task) => (
            <Task key={task._id} task={task}/>
        ));
    }

    render() {
        // var e = this.state.error.get();
        var e = this.props.error;
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
    tasks: PropTypes.array,
    loading: PropTypes.bool,
    error: PropTypes.object
};

export default container(function (props, onData) {
    const taskHandle = Meteor.subscribe('tasks', {
        onError: function (err) {
            onData(null, {
                error: err
            });
        }
    });

    if (taskHandle.ready()) {
        onData(null, {
            tasks: Tasks.find({}, {sort: {createdAt: -1}}).fetch(),
            currentUser: Meteor.user()
        });
    }
    else {
        onData(null, {
            loading: true
        });
    }
}, App);
