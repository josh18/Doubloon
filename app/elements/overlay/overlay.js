import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

// Wrappers
import CSSModules from 'wrappers/css-modules';

// Utils
import transitionEnd from 'utils/transition-end';

// Styles
import styles from './styles.less';

// TODO
// On close return focus to initiator or other related element
// Doesn't prevent scroll outside of dialogue before switching focus to inside dialogue ??
// Doesn't have label
// Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_dialog_role

class Overlay extends Component {
    constructor(props) {
        super(props);

        this.state = {
            transitionShow: true,
            transitionHide: false
        };
    }

    componentWillMount() {
        document.addEventListener('keydown', this.handleGlobalKeyPress);
        document.addEventListener('focusin', this.handleGlobalFocusIn);
        document.addEventListener('focusout', this.handleGlobalFocusOut);
    }

    componentDidMount() {
        this.updateFocus();

        window.getComputedStyle(this.overlayElement).opacity; // force reflow
        this.setState({
            transitionShow: false
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.close) {
            this.close();
        }
    }

    componentDidUpdate() {
        this.updateFocus();
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleGlobalKeyPress);
        document.removeEventListener('focusin', this.handleGlobalFocusIn);
        document.removeEventListener('focusout', this.handleGlobalFocusOut);
    }

    getFocusableElements() {
        if (this.overlayElement) {
            let focusableSelector = [
                'a[href]',
                'button',
                'input',
                'object',
                'select',
                'textarea',
                '[tabindex]'
            ];
            focusableSelector.forEach(function(v, i) {
                focusableSelector[i] += ':not(:disabled):not([tabindex^="-1"])';
            });
            return this.overlayElement.querySelectorAll(focusableSelector.join(', '));
        }
    }

    updateFocus() {
        function compareFocusableElement(selector1, selector2) {
            if (selector1.length !== selector2.length) {
                return false;
            }

            [...selector1].forEach((node, i) => {
                if (node !== selector2[i]) {
                    return false;
                }
            });
        }

        const focusableElements = this.getFocusableElements();
        // If the number of focusable elements changes its time for an update
        if (!this.focusableElements || compareFocusableElement(focusableElements, this.focusableElements)) {
            // Store the focusable elements
            this.focusableElements = focusableElements;
            // Focus the first element
            focusableElements[0].focus();
        }
    }

    handleGlobalKeyPress = (e) => {
        // Escape key
        if (e.key === 'Escape') {
            this.close();
        }
    }

    handleGlobalFocusIn = (e) => {
        e.preventDefault();
        if (this.overlayElement && !this.overlayElement.contains(e.target)) {
            if (this.focusOut && this.focusOut === this.focusableElements[0]) {
                this.focusableElements[this.focusableElements.length - 1].focus();
            } else {
                this.focusableElements[0].focus();
            }
        }
    }

    handleGlobalFocusOut = (e) => {
        this.focusOut = e.target;
    }

    close = () => {
        let closeCallback = this.props.closeCallback;

        this.setState({
            transitionHide: true
        });

        transitionEnd(this.overlayElement, closeCallback);
    }

    render() {
        let {
            backgroundClose,
            children,
            className
        } = this.props;

        let backgroundClick;
        if (backgroundClose) {
            backgroundClick = this.close;
        }

        let overlayClass = classNames({
            overlay: true,
            'transition-show': this.state.transitionShow,
            'transition-hide': this.state.transitionHide
        });

        return (
            <section styleName={overlayClass} role="dialog" ref={element => this.overlayElement = element}>
                <div styleName="overlay-background" onClick={backgroundClick}></div>
                <div className={className} styleName="overlay-content">{children}</div>
            </section>
        );
    }
}

Overlay.defaultProps = {
    backgroundClose: true,
};

Overlay.propTypes = {
    backgroundClose: PropTypes.bool,
    children: PropTypes.node,
    className: PropTypes.string,
    closeCallback: PropTypes.func.isRequired,
    close: PropTypes.bool
};

Overlay = CSSModules(Overlay, styles);

export default Overlay;
