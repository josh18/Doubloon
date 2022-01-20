// Modules
import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

// Wrappers
import CSSModules from 'wrappers/css-modules';

// Elements
import Button from 'elements/button/button';
import Icon from 'elements/icon/icon';

// Utils
import uniqueId from 'utils/unique-id';

// Styles
import styles from './styles.less';

// TODO
// Set width on mount / update (not sure if necessary, maybe make as an option)

class Select extends Component {
    constructor(props) {
        super(props);

        let selected =  this.getActiveIndex(props);

        this.state = {
            filter: '',
            open: false,
            selected
        };

        this.activeId = uniqueId();
        this.dropdownId = uniqueId();
    }

    componentDidMount() {
        document.addEventListener('click', this.handleGlobalEvent);
        document.addEventListener('focusin', this.handleGlobalEvent);
    }

    componentWillReceiveProps(nextProps) {
        let selected =  this.getActiveIndex(nextProps);

        this.setState({
            selected
        });
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleGlobalEvent);
        document.removeEventListener('focusin', this.handleGlobalEvent);
    }

    handleGlobalEvent = (e) => {
        if (this.selectElement !== e.target && !this.selectElement.contains(e.target) && document.contains(e.target)) {
            this.closeDropdown();
        }
    }

    handleKeyDown = (e) => {
        let options = this.props.options;

        let {
            highlighted,
            open,
            selectedOnClose
        } = this.state;

        switch (e.key) {
            case 'ArrowUp':
                e.preventDefault();
                if (open) {
                    this.highlightPreviousOption();
                } else {
                    this.selectPreviousOption();
                }

                break;
            case 'ArrowDown':
                e.preventDefault();
                if (this.state.open) {
                    this.highlightNextOption();
                } else {
                    this.selectNextOption();
                }

                break;
            case 'Enter':
            case ' ':
                if (open && highlighted !== selectedOnClose) {
                    this.setState({
                        selectedOnClose: highlighted
                    });
                }

                break;
            case 'Escape':
                this.closeDropdown();
                break;
        }

        // Quick filter (user typing)
        if (e.key.length === 1 && open) {
            let key = e.key.toLowerCase();
            let filter = this.state.filter + key;

            let newState = {
                filter
            };

            // If the same letter is pressed cycle through all options starting with that letter
            if (filter && /^(.)\1*$/.test(filter)) {
                let startingLetterOptions = [];
                options.forEach((option, i) => {
                    if (option.name[0].toLowerCase() === filter[0]) {
                        startingLetterOptions.push(i);
                    }
                });

                if (startingLetterOptions.length) {
                    let nextHighlight;
                    if (startingLetterOptions.contains(highlighted)) {
                        let nextHighlightIndex = startingLetterOptions.indexOf(highlighted);
                        if (nextHighlightIndex === startingLetterOptions.length - 1) {
                            nextHighlightIndex = 0;
                        } else {
                            nextHighlightIndex++;
                        }

                        nextHighlight = startingLetterOptions[nextHighlightIndex];
                    } else {
                        nextHighlight = startingLetterOptions[0];
                    }

                    newState.highlighted = nextHighlight;
                    newState.selectedOnClose = nextHighlight;
                }
            } else {
                options.forEach((option, i) => {
                    if (!newState.highlighted && option.name.toLowerCase().startsWith(filter)) {
                        newState.highlighted = i;
                        newState.selectedOnClose = i;
                    }
                });
            }

            this.setState(newState);
            this.resetFilterTimeout();
        }
    }

    resetFilterTimeout = () => {
        // Clear any existing timeouts
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }

        // Clear the quick filter (user typing) after 1 second
        this.timeoutId = setTimeout(() => {
            this.setState({
                filter: ''
            });
            this.timeoutId = null;
        }, 1000);
    }

    getActiveIndex = (props) => {
        let {
            options,
            value
        } = props;

        let currentIndex;
        options.forEach((option, i) => {
            if (option.value.toString() === value.toString()) {
                currentIndex = i;
            }
        });

        return currentIndex;
    }

    openDropdown = () => {
        let {
            open,
            selected
        } = this.state;

        if (!open) {
            this.setState({
                highlighted: selected,
                open: true,
                selectedOnClose: selected
            });
        }
    }

    closeDropdown = (option) => {
        let options = this.props.options;

        let {
            open,
            selectedOnClose
        } = this.state;

        if (option) {
            this.selectOption(option);
        } else if (selectedOnClose || selectedOnClose === 0) {
            this.selectOption(options[selectedOnClose].value);
        }

        if (open) {
            this.setState({
                open: false,
                selectedOnClose: false
            });
        }
    }

    toggleDropdown = () => {
        if (this.state.open) {
            this.closeDropdown();
        } else {
            this.openDropdown();
        }
    }

    selectOption = (value) => {
        let {
            onChange,
            name
        } = this.props;

        if (value !== this.props.value) {
            onChange({
                name,
                value
            });
        }
    }

    selectPreviousOption = () => {
        let options = this.props.options;

        let selected = this.state.selected;
        selected--;

        if (selected >= 0) {
            this.selectOption(options[selected].value);
        }
    }

    selectNextOption = () => {
        let options = this.props.options;

        let selected = this.state.selected;
        selected++;

        if (selected <= options.length - 1) {
            this.selectOption(options[selected].value);
        }
    }

    highlightPreviousOption = () => {
        let highlighted = this.state.highlighted;
        highlighted--;

        if (highlighted >= 0) {
            this.setState({
                highlighted,
                selectedOnClose: highlighted
            });
        }
    }

    highlightNextOption = () => {
        let options = this.props.options;

        let highlighted = this.state.highlighted;
        highlighted++;

        if (highlighted <= options.length - 1) {
            this.setState({
                highlighted,
                selectedOnClose: highlighted
            });
        }
    }

    render() {
        let {
            alignDropdown,
            className: customClassName,
            options,
            toggleClassName: customToggleClassName
        } = this.props;

        let {
            highlighted,
            open,
            selected,
            selectedOnClose
        } = this.state;

        let selectedId;
        let selectedName = options[0].name;

        options = options.map((option, i) => {
            let id = this.dropdownId + '-' + i;

            let isSelected;
            if (open) {
                isSelected = i === selectedOnClose;
            } else {
                isSelected = i === selected;
            }

            if (isSelected) {
                selectedId = id;
                selectedName = option.name;
            }

            let optionClass = classNames({
                'option': true,
                'is-highlighted': highlighted === i
            });

            let handleClick = () => {
                this.closeDropdown(option.value.toString());
            };

            let handleMouseMove = () => {
                if (highlighted !== i) {
                    this.setState({
                        highlighted: i
                    });
                }
            };

            return (
                <li id={id} role="option" key={i}>
                    <Button tabIndex="-1" styleName={optionClass} onClick={handleClick} onMouseMove ={handleMouseMove}>{option.name}</Button>
                </li>
            );
        });

        let selectClass = classNames({
            select: true,
            'is-open': open
        });

        let dropdownClass = classNames({
            'dropdown': true,
            'align-right': alignDropdown === 'right'
        });

        return (
            <div styleName={selectClass} className={customClassName} ref={element => this.selectElement = element}>
                <button styleName="toggle" className={customToggleClassName} onClick={this.toggleDropdown} onKeyDown={this.handleKeyDown} aria-haspopup="true" aria-expanded={open ? 'true' : 'false'} aria-owns={this.dropdownId}>{selectedName}<Icon styleName="toggle-icon" type="triangle-down" size={4} /></button>
                <ol styleName={dropdownClass} id={this.dropdownId} role="listbox" aria-label={this.props['aria-label']} aria-labelledby={this.props['aria-labelledby']} aria-hidden={open ? 'false' : 'true'} aria-activedescendant={selectedId}>
                    {options}
                </ol>
            </div>
        );
    }
}

Select.propTypes = {
    alignDropdown: PropTypes.oneOf(['left', 'right']),
    'aria-label': PropTypes.string,
    'aria-labelledby': PropTypes.string,
    className: PropTypes.string,
    name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        })
    ),
    toggleClassName: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

Select = CSSModules(Select, styles);

export default Select;
