# Meteor React container error handling
Handling errors from Meteor subscriptions using React as frontend.

There are two different ways to create a container:
* using [meteor/react-meteor-data](https://github.com/meteor/react-packages/tree/master/packages/react-meteor-data), a native approach
* using [arunoda/react-komposer](https://github.com/arunoda/react-komposer)

## meteor/react-meteor-data
[Master branch](../../tree/master)  
See [App.jsx](../../tree/master/imports/ui/App.jsx)

Error handling is made possible by using `ReactiveVar`. `error` variable is defined in the App module.  
This variable should be used in `withTracker` method where the dependency is registered:
```
export default withTracker((props) => {
    ...
    return {
        error: error.get(),
        ...
    };
})(App)
```

And used in render() function:
```
render() {
    var e = error.get();
    if (e) {
        content = (<div>Sorry, mate. You just got errored. {e.message}</div>)
    }
    ...
}
```

**Summary**  
In this approach props are returned in the `withTracker` function. Error handling is entirely in that function.
Some considerations are required if we want to prevent endless loop.

**Pros:**
* better for containers where no error handling is necessary

**Cons:**
* module variable (`error = ReactiveVar(null)`) must be used to handle errors
* when handling the errors, some things are returned, some updated through reactive vars

## arunoda/react-komposer
[Komposer branch](../../tree/komposer)  
See [App.jsx](../../tree/komposer/imports/ui/App.jsx)

Error handling and data fetching are handled in function passed to `container` function:
```
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
```

**Summary**  
Everything is handled in function passed to `container`.

**Pros:**
* data & error handling done consistently (onData callback, no return value)
* no module variables

**Cons:**
* somewhat more complex container function
