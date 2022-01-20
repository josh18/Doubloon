// Modules
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

// Wrappers
import CSSModules from 'wrappers/css-modules';

// Elements
import Button from 'elements/button/button';
import Overlay from 'elements/overlay/overlay';

// Utils
import mapDispatchToPropsComposer from 'utils/map-dispatch-to-props';
import uniqueId from 'utils/unique-id';

// Actions
import { createVendor, updateVendor } from '../actions';

// Selectors
import { selectVendors } from '../selectors';
import { makeSelectVendorExpanded } from '../selectors-expanded';
import { selectCategories } from 'containers/categories/selectors';

// Styles
import styles from './edit-vendor.less';

// TODO
// Delete vendor
// Output errors

class CategoriesSelect extends Component {
    handleInputChange = (e) => {
        this.props.onChange(e.target.value, e.target.checked);
    }

    render() {
        let {
            categoriesList,
            selected
        } = this.props;

        // Sort alphabetically
        let categories = categoriesList.sort((a, b) => {
            return a.name.localeCompare(b.name);
        });

        categories = categories.map((category, key) => {
            return (
                <div className="checkbox" key={key}>
                    <label>
                        <input type="checkbox" value={category.id} checked={selected.includes(category.id)} onChange={this.handleInputChange} /> {category.name}
                    </label>
                </div>
            );
        });

        return (
            <div className="form-field">
                {categories}
            </div>
        );
    }
}

CategoriesSelect.propTypes = {
    categoriesList: PropTypes.arrayOf(
        PropTypes.shape({
            colour: PropTypes.string.isRequired,
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired
        })
    ),
    onChange: PropTypes.func.isRequired,
    selected: PropTypes.arrayOf(PropTypes.string),
};

class EditVendor extends Component {
    constructor(props) {
        super(props);

        let selectedCategories = [];
        if (props.id) {
            if (props.categories) {
                selectedCategories = props.categories.map((category) => {
                    return category.id;
                });
            }

            this.state = {
                autoCategorise: props.autoCategorise,
                selectedCategories,
                name: props.name,
                pattern: props.pattern
            };
        } else {
            this.state = {
                autoCategorise: false,
                selectedCategories: [],
                name: '',
                pattern: ''
            };
        }

        this.nameId = uniqueId();
        this.patternId = uniqueId();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.id) {
            let selectedCategories = [];
            if (nextProps.categories) {
                selectedCategories = nextProps.categories.map((category) => {
                    return category.id;
                });
            }

            this.setState({
                autoCategorise: nextProps.autoCategorise,
                selectedCategories,
                name: nextProps.name,
                pattern: nextProps.pattern
            });
        }
    }

    handleInputChange = (e) => {
        let {checked, name, type, value} = e.target;

        if (name === 'pattern') {
            value = value.toLowerCase();
        }

        if (type === 'checkbox') {
            value = checked;
        }

        this.setState({
            [name]: value
        });
    }

    handleCategoryChange = (category, checked) => {
        if (checked && !this.state.selectedCategories.includes(category)) {
            this.setState({
                selectedCategories: this.state.selectedCategories.concat([category])
            });
        }

        if (!checked && this.state.selectedCategories.includes(category)) {
            this.setState({
                selectedCategories: this.state.selectedCategories.filter(currentCategory => currentCategory !== category)
            });
        }
    }

    save = () => {
        let {
            id,
            routeToParent
        } = this.props;

        let {
            autoCategorise,
            name,
            pattern,
            selectedCategories
        } = this.state;

        let errors = this.checkValidInput();

        if (Object.keys(errors).length) {
            // TODO: Output errors
            console.log(errors);
        } else {
            if (id) {
                this.props.updateVendor(id, name, pattern, selectedCategories, autoCategorise);
            } else {
                this.props.createVendor(name, pattern, selectedCategories, autoCategorise);
            }

            routeToParent();
        }
    }

    checkValidInput = () => {
        let {
            name
        } = this.state;

        let errors = {};

        // Check name exists
        if (!name) {
            errors.name = 'You must enter a name.';
        }

        // Check name doesn't match an existing category name
        if (!errors.name && this.conflictingVendorName(name, this.props.id)) {
            errors.name = 'There is already a vendor with that name.';
        }

        return errors;
    }

    conflictingVendorName = (name, id) => {
        this.props.vendors.forEach((vendor) => {
            if (vendor.name.toLowerCase() === name.toLowerCase() && id !== vendor.id) {
                return true;
            }
        });

        return false;
    }

    render() {
        let {
            categoriesList,
            id,
            routeToParent
        } = this.props;

        let {
            autoCategorise,
            name,
            pattern,
            selectedCategories
        } = this.state;

        let title = 'Create Vendor';
        if (id) {
            title = 'Edit Vendor';
        }

        return (
            <Overlay styleName="edit-vendor" closeCallback={routeToParent}>
                <h1>{title}</h1>

                <div className="form-field" styleName="form-field">
                    <label htmlFor={this.nameId}>Name</label>
                    <input type="text" id={this.nameId} name="name" value={name} onChange={this.handleInputChange} autoFocus />
                </div>

                <div className="form-field" styleName="form-field">
                    <label htmlFor={this.patternId}>Pattern</label>
                    <input type="text" id={this.patternId} name="pattern" value={pattern} onChange={this.handleInputChange} />
                </div>

                <div className="form-field" styleName="form-field">
                    <CategoriesSelect categoriesList={categoriesList} selected={selectedCategories} onChange={this.handleCategoryChange} />
                </div>

                <div className="form-field" styleName="form-field">
                    <label>
                        <input type="checkbox" name="autoCategorise" checked={autoCategorise} onChange={this.handleInputChange} /> Automatically categorise new transactions
                    </label>
                </div>

                <div styleName="controls">
                    <Button styleName="cancel" onClick={routeToParent}>Cancel</Button>
                    <Button styleName="save" onClick={this.save}>Save</Button>
                </div>
            </Overlay>
        );
    }
}

EditVendor.propTypes = {
    autoCategorise: PropTypes.bool,
    categoriesList: PropTypes.arrayOf(
        PropTypes.shape({
            colour: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired
        })
    ).isRequired,
    categories: PropTypes.arrayOf(
        PropTypes.shape({
            colour: PropTypes.string.isRequired,
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired
        })
    ),
    createVendor: PropTypes.func.isRequired,
    id: PropTypes.string,
    name: PropTypes.string,
    pattern: PropTypes.string,
    routeToParent: PropTypes.func.isRequired,
    updateVendor: PropTypes.func.isRequired,
    vendors: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
        })
    ).isRequired
};

const makeMapStateToProps = () => {
    const selectVendorExpanded = makeSelectVendorExpanded();
    const mapStateToProps = (state, props) => {
        let vendor = selectVendorExpanded(state, props);
        return Object.assign({
            categoriesList: selectCategories(state, props),
            vendors: selectVendors(state, props)
        }, vendor);
    };

    return mapStateToProps;
};

const mapDispatchToProps = mapDispatchToPropsComposer({
    createVendor,
    updateVendor
});

EditVendor = CSSModules(EditVendor, styles);
EditVendor = connect(makeMapStateToProps, mapDispatchToProps)(EditVendor);

export default EditVendor;
