// Modules
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

// Wrappers
import CSSModules from 'wrappers/css-modules';

// Elements
import Button from 'elements/button/button';
import ColourPicker from 'elements/colour-picker/colour-picker';
import Overlay from 'elements/overlay/overlay';

// Utils
import mapDispatchToPropsComposer from 'utils/map-dispatch-to-props';
import uniqueId from 'utils/unique-id';

// Actions
import { createCategory, updateCategory } from '../actions';

// Selectors
import { makeSelectCategory, selectCategories } from '../selectors';

// Styles
import styles from './edit-category.less';

// TODO
// Delete category
// Output errors

class EditCategory extends Component {
    constructor(props) {
        super(props);

        if (props.id) {
            this.state = {
                colour: props.colour,
                name: props.name
            };
        } else {
            this.state = {
                colour: '#ccc',
                name: ''
            };
        }

        this.nameId = uniqueId();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.id) {
            this.setState({
                colour: nextProps.colour,
                name: nextProps.name
            });
        }
    }

    handleInputChange = (e) => {
        let input = e.target;

        this.setState({
            [input.name]: input.value
        });
    }

    handleColourChange = (value) => {
        this.setState({
            colour: value
        });
    }

    save = () => {
        let {
            id,
            routeToParent
        } = this.props;

        let {
            colour,
            name
        } = this.state;

        let errors = this.checkValidInput();

        if (Object.keys(errors).length) {
            // TODO: Output errors
            console.log(errors);
        } else {
            if (id) {
                this.props.updateCategory(id, name, colour);
            } else {
                this.props.createCategory(name, colour);
            }
            routeToParent();
        }
    }

    checkValidInput = () => {
        let {
            colour,
            name
        } = this.state;

        let errors = {};

        // Check name exists
        if (!name) {
            errors.name = 'You must enter a name.';
        }

        // Check name doesn't match an existing category name
        if (!errors.name && this.conflictingCategoryName(name, this.props.id)) {
            errors.name = 'There is already a category with that name.';
        }

        // Check for valid hex colour
        if (!/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(colour)) {
            errors.colour = 'Invalid colour.';
        }

        return errors;
    }

    conflictingCategoryName = (name, id) => {
        this.props.categories.forEach((category) => {
            if (category.name.toLowerCase() === name.toLowerCase() && id !== category.id) {
                return true;
            }
        });

        return false;
    }

    render() {
        let {
            id,
            routeToParent
        } = this.props;

        let {
            colour,
            name
        } = this.state;

        let title = 'Create Category';
        if (id) {
            title = 'Edit Category';
        }

        return (
            <Overlay styleName="edit-category" closeCallback={routeToParent}>
                <h1>{title}</h1>

                <div className="form-field" styleName="form-field">
                    <label htmlFor={this.nameId}>Name</label>
                    <input type="text" id={this.nameId} name="name" value={name} onChange={this.handleInputChange} autoFocus />
                </div>

                <div className="form-field" styleName="form-field">
                    <ColourPicker className={styles['colour-input']} value={colour} onChange={this.handleColourChange} />
                </div>

                <div styleName="controls">
                    <Button styleName="cancel" onClick={routeToParent}>Cancel</Button>
                    <Button styleName="save" onClick={this.save}>Save</Button>
                </div>
            </Overlay>
        );
    }
}

EditCategory.propTypes = {
    categories: PropTypes.arrayOf(
        PropTypes.shape({
            colour: PropTypes.string.isRequired,
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired
        })
    ),
    colour: PropTypes.string,
    createCategory: PropTypes.func.isRequired,
    id: PropTypes.string,
    name: PropTypes.string,
    routeToParent: PropTypes.func.isRequired,
    updateCategory: PropTypes.func.isRequired,
};

EditCategory = CSSModules(EditCategory, styles);

const makeMapStateToProps = () => {
    const selectCategory = makeSelectCategory();
    const mapStateToProps = (state, props) => {
        let category = selectCategory(state, props);
        return Object.assign({
            categories: selectCategories(state, props)
        }, category);
    };

    return mapStateToProps;
};

const mapDispatchToProps = mapDispatchToPropsComposer({
    createCategory,
    updateCategory
});

EditCategory = connect(makeMapStateToProps, mapDispatchToProps)(EditCategory);

export default EditCategory;
