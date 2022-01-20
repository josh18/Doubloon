// Modules
import CSSModules from 'react-css-modules';

function CSSModulesWrapper(component, styles) {
    let options = {
        allowMultiple: true,
        errorWhenNotFound: false
    };

    return CSSModules(component, styles, options);
}

export default CSSModulesWrapper;
