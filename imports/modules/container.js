import { compose } from 'react-komposer';
import { Tracker } from 'meteor/tracker';

function getTrackerLoader(reactiveMapper) {
    return (props, onData, env) => {
        let trackerCleanup = null;
        const handler = Tracker.nonreactive(() => {
            return Tracker.autorun(() => {
                // assign the custom clean-up function.
                trackerCleanup = reactiveMapper(props, onData, env);
            });
        });

        return () => {
            if(typeof trackerCleanup === 'function') trackerCleanup();
            return handler.stop();
        };
    };
}

export default function container(composer, Component, options = {}) {
    return compose(getTrackerLoader(composer), options)(Component);
}
