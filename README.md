# Meteor React container error handling
Handling errors from Meteor subscriptions using React as frontend.

There are two different ways to create a container:
* using [meteor/react-meteor-data](https://github.com/meteor/react-packages/tree/master/packages/react-meteor-data), a native approach
* using [arunoda/react-komposer](https://github.com/arunoda/react-komposer)

## meteor/react-meteor-data
[Master branch](../../tree/master)  
See [App.jsx](../../tree/master/imports/ui/App.jsx)

Error handling is made possible by using `ReactiveVar`. `error` variable is defined in the App module.  
This variable should be used in the state of the component:
```
constructor(props) {
    super(props);
    this.state = {error: error};
}
```

And used in render() function:
```
render() {
    var e = this.state.error.get();
    if (e) {
        return (<div>Sorry, mate. You just got errored. {e.message}</div>)
    }
    ...
}
```

**Summary**  
In this approach props are return to the `createContainer` function. Error handling is done separately.

**Pros:**
* simple container function
* better for containers where no error handling is necessary

**Cons:**
* component state and module variable (`error`) must be used to handle errors

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
* data & error handling in one place
* no state and module variables

**Cons:**
* more complex container function
