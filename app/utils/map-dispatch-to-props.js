/*
const mapDispatchToProps = mapDispatchToPropsComposer({createThing, destroyThing});

is the same as

function mapDispatchToProps(dispatch) {
    return {
        createThing: (name, date) => dispatch(createThing(name, thing)),
        destroyThing: (id) => dispatch(destroyThing(id))
    };
}
*/

export default function mapDispatchToPropsComposer(actions) {
    return (dispatch) => {
        let actionsList = {};
        Object.entries(actions).forEach(([key, action]) => {
            if (typeof action === 'undefined') {
                throw new Error('Action ' + key + ' passed to mapDispatchToPropsComposer() is undefined.');
            }

            actionsList[key] = (...args) => dispatch(action(...args));
        });

        return actionsList;
    };
}
