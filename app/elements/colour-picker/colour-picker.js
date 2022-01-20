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

class Dropdown extends Component {
    render() {
        const {
            isOpen,
            onSelect
        } = this.props;

        // let colours = [
        //     '#e53939',
        //     '#e5ba39',
        //     '#8fe539',
        //     '#39e564',
        //     '#39e5e5',
        //     '#3964e5',
        //     '#8f39e5',
        //     '#e539ba'
        // ];

        let colours = [
            '#e52e2e', // Red
            '#f2590c', // Orange
            '#f7e731', // Yellow
            '#52cc52', // Light Green
            '#268026', // Dark Green
            '#13bfa3', // Green Blue
            '#177ee5', // Blue
            '#364ab2', // Dark blue
            '#800d6c', // Purple
            '#e62e8a'  // Pink
        ];

        colours = colours.map((colour, i) => {
            const colourStyle = {
                backgroundColor: colour
            };

            const onClick = () => {
                onSelect(colour);
            };

            return <Button onClick={onClick} styleName="dropdown-colour" style={colourStyle} key={i} />;
        });

        let dropdownClass = classNames({
            dropdown: true,
            'is-open': isOpen
        });

        return (
            <div styleName={dropdownClass}>
                {colours}
            </div>
        );
    }
}

Dropdown.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onSelect: PropTypes.func.isRequired
};

Dropdown = CSSModules(Dropdown, styles);

class ColourPicker extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dropdown: false
        };

        this.inputId = uniqueId();
    }

    componentDidMount() {
        document.addEventListener('click', this.handleGlobalClick);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleGlobalClick);
    }

    handleGlobalClick = (e) => {
        if (this.pickerElement !== e.target && !this.pickerElement.contains(e.target)) {
            this.closeDropdown();
        }
    }

    toggleDropdown = () => {
        this.setState({
            dropdown: !this.state.dropdown
        });
    }

    closeDropdown = () => {
        this.setState({
            dropdown: false
        });
    }

    handleInputChange = (e) => {
        let value = e.target.value;

        if (value[0] !== '#') {
            e.target.value = '#' + value;
        }

        this.props.onChange(value);
    }

    handleDropdownSelect = (value) => {
        this.props.onChange(value);
        this.closeDropdown();
    }

    render() {
        let value = this.props.value;

        let colourPickerStyle = {
            backgroundColor: value
        };

        return (
            <div className={this.props.className}>
                <label htmlFor={this.inputId}>Colour</label>
                <div styleName="colour-picker">
                    <input styleName="colour-picker-input" type="text" id={this.inputId} maxLength="7" value={value} onChange={this.handleInputChange} />
                    <div ref={element => this.pickerElement = element}>
                        <Button styleName="dropdown-toggle" style={colourPickerStyle} onClick={this.toggleDropdown} />
                        <Dropdown onSelect={this.handleDropdownSelect} isOpen={this.state.dropdown} />
                    </div>
                </div>
            </div>
        );
    }
}

ColourPicker.propTypes = {
    className: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired
};

ColourPicker = CSSModules(ColourPicker, styles);

export default ColourPicker;
