// Modules
import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

// Wrappers
import CSSModules from 'wrappers/css-modules';

// Elements
import Button from 'elements/button/button';

// Utils
import uniqueId from 'utils/unique-id';

// Styles
import styles from './styles.less';

// TODO
// Close icon (svg?)
// Highlight on id instead of index
// Use <ol>

class SelectedOption extends Component {
    handleClick = () => {
        this.props.onRemove(this.props.id);
    }

    render() {
        let name = this.props.name;

        return (
            <div styleName="selected-option">
                <div styleName="selected-option-name">{name}</div>
                <Button styleName="selected-option-remove" onClick={this.handleClick} aria-label="Remove">x</Button>
            </div>
        );
    }
}

SelectedOption.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    onRemove: PropTypes.func.isRequired
};

SelectedOption = CSSModules(SelectedOption, styles);

class Dropdown extends Component {
    render() {
        let {
            highlightedOption,
            options
        } = this.props;

        if (options.length) {
            options = options.map(({name, id}, i) => {
                let dropdownItemClass = classNames({
                    'dropdown-item': true,
                    'is-selected': i === highlightedOption
                });

                return <Button styleName={dropdownItemClass} onClick={() => this.props.selectOption(id)} tabIndex="-1" key={i}>{name}</Button>;
            });
        } else {
            options = <div styleName="dropdown-no-results">No results found.</div>;
        }

        return (
            <div styleName="dropdown">
                {options}
            </div>
        );
    }
}

Dropdown.propTypes = {
    highlightedOption: PropTypes.number.isRequired,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired
        }),
    ).isRequired,
    selectOption: PropTypes.func.isRequired
};

Dropdown = CSSModules(Dropdown, styles);

class QuickSelect extends Component {
    constructor(props) {
        super(props);

        this.state = {
            highlightedOption: 0,
            open: false,
            text: ''
        };

        this.inputId = uniqueId();
    }

    componentDidMount() {
        document.addEventListener('click', this.handleGlobalEvent);
        document.addEventListener('focusin', this.handleGlobalEvent);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleGlobalEvent);
        document.removeEventListener('focusin', this.handleGlobalEvent);
    }

    handleGlobalEvent = (e) => {
        if (this.pickerElement !== e.target && !this.pickerElement.contains(e.target) && document.contains(e.target)) {
            this.closeDropdown();
        }
    }

    handleInputChange = (e) => {
        this.setState({
            highlightedOption: 0,
            text: e.target.value
        });
    }

    handleInputFocus = () => {
        this.openDropdown();
    }

    handleInputKeyPress = (e) => {
        let options = this.filteredOptions();

        if (e.key === 'Enter') {
            let highlightedOption = options[this.state.highlightedOption].id;
            if (highlightedOption) {
                this.selectOption(highlightedOption);
            }
        }
    }

    handleInputKeyDown = (e) => {
        let {
            onChange,
            selected
        } = this.props;

        let highlightedOption = this.state.highlightedOption;

        let filteredOptions = this.filteredOptions();

        switch (e.key) {
            case 'ArrowUp':
                highlightedOption--;

                if (highlightedOption >= 0) {
                    this.setState({
                        highlightedOption
                    });
                }

                break;
            case 'ArrowDown':
                highlightedOption++;

                if (highlightedOption <= filteredOptions.length - 1) {
                    this.setState({
                        highlightedOption
                    });
                }

                break;
            case 'Backspace':
                if (!this.state.text) {
                    // Remove the option from currently selected options
                    let addedOption = selected.pop();
                    addedOption = this.props.options.filter(({id}) => {
                        return id === addedOption;
                    })[0];

                    let newHighlightedOption = 0;
                    if (filteredOptions.length && selected.length) {
                        // Get the id of the currently highlighted option
                        let currentHighlightedOption = filteredOptions[highlightedOption].id;

                        // Simulate adding the readded option to the options list so that we can find the newly highlighted number
                        // This way we can keep the highlight on the current option
                        filteredOptions.push(addedOption);

                        // Filter alphabetically to match this.filteredOptions()
                        filteredOptions = filteredOptions.sort((a, b) => {
                            return a.name.localeCompare(b.name);
                        });

                        // Find the index of the currently highlighted option
                        filteredOptions.forEach(({id}, i) => {
                            if (id === currentHighlightedOption) {
                                newHighlightedOption = i;
                            }
                        });
                    }

                    this.setState({highlightedOption: newHighlightedOption});
                    onChange(selected);
                }
                break;
            case 'Escape':
                this.setState({
                    text: ''
                });
                break;
        }
    }

    openDropdown = (preventGlobalBubbling) => {
        if (preventGlobalBubbling) {
            document.removeEventListener('click', this.handleGlobalEvent);
            document.removeEventListener('focusin', this.handleGlobalEvent);
            document.addEventListener('click', this.handleGlobalEvent);
            document.addEventListener('focusin', this.handleGlobalEvent);
        }

        if (!this.state.open) {
            this.setState({
                open: true
            });

            if (this.inputElement) {
                this.inputElement.focus();
            }
        }
    }

    closeDropdown = () => {
        this.props.options.forEach(({name, id}) => {
            if (name.toLowerCase() === this.state.text.toLowerCase()) {
                this.selectOption(id);
                this.setState({
                    text: ''
                });
            }
        });

        if (this.state.open) {
            this.setState({
                open: false
            });
        }
    }

    selectOption = (id) => {
        let {
            onChange,
            selected
        } = this.props;

        let highlightedOption = this.state.highlightedOption;

        if (!selected.includes(id)) {

            // If the currently highlighted option is the last option
            // And there will be at least one option remaining
            // Then move to the upcoming last option
            if (highlightedOption > this.filteredOptions().length - 2 && this.filteredOptions().length > 1) {
                highlightedOption = this.filteredOptions().length - 2;
            }

            this.setState({
                highlightedOption,
                text: ''
            });

            onChange(selected.concat([id]));
        }
    }

    unselectOption = (id) => {
        let {
            onChange,
            selected
        } = this.props;

        if (selected.includes(id)) {
            onChange(selected.filter(currentId => currentId !== id));
        }
    }

    filteredOptions = () => {
        let selected = this.props.selected;

        let text = this.state.text;

        let options = this.props.options;

        // Filter out already selected options and filter by currently typed text
        options = options.filter(({id, name}) => {
            return !selected.includes(id) && name.toLowerCase().includes(text.toLowerCase());
        });

        // Sort alphabetically
        options = options.sort((a, b) => {
            return a.name.localeCompare(b.name);
        });

        return options;
    }

    render() {
        let {
            autoFocus,
            className,
            label,
            options,
            selected,
        } = this.props;

        let {
            highlightedOption,
            open,
            text
        } = this.state;

        // Create an object "id: name" to make it easier to find the options name
        let optionsObject = {};
        options.forEach(({id, name}) => {
            optionsObject[id] = name;
        });

        // Display the selected options
        let selectedOptions = selected.map((id, key) => {
            return <SelectedOption id={id} name={optionsObject[id]} onRemove={this.unselectOption} key={key} />;
        });

        let containerClass = classNames({
            'form-field': true,
            [className]: className
        });

        let quickSelectClass = classNames({
            'quick-select': true,
            'is-open': open
        });

        return (
            <div className={containerClass}>
                <label htmlFor={this.inputId}>{this.props.label}</label>
                <div styleName={quickSelectClass} ref={element => this.pickerElement = element}>
                    <div styleName="input" onClick={() => this.openDropdown()} ref={element => this.selectElement = element}>
                        {selectedOptions}
                        <input styleName="input-text" type="text" id={this.inputId} value={text} autoFocus={autoFocus} onChange={this.handleInputChange} onFocus={this.handleInputFocus} onBlur={this.handleInputBlur} onKeyPress={this.handleInputKeyPress} onKeyDown={this.handleInputKeyDown} ref={element => this.inputElement = element} />
                    </div>
                    <Dropdown options={this.filteredOptions()} selectOption={this.selectOption} highlightedOption={highlightedOption} />
                </div>
            </div>
        );
    }
}

QuickSelect.propTypes = {
    autoFocus: PropTypes.bool,
    className: PropTypes.string,
    label: PropTypes.string.isRequired,
    selected: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired
        }),
    ).isRequired,
};

QuickSelect = CSSModules(QuickSelect, styles);

export default QuickSelect;
