// Modules
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

// Wrappers
import CSSModules from 'wrappers/css-modules';

// Utils
import mapDispatchToPropsComposer from 'utils/map-dispatch-to-props';

// Actions
import { importData } from './actions';

// Styles
import styles from './styles.less';

// Components
import Demo from './components/demo';
import Export from './components/export';
import Reset from './components/reset';

class Settings extends Component {
    componentDidMount() {
        this.props.setPageTitle('Settings');
    }

    componentWillUnmount() {
        this.props.setPageTitle();
    }

    render() {
        let {
            data,
            history: {
                push
            },
            importData
        } = this.props;

        return (
            <div styleName="settings">
                <div styleName="actions">
                    <Demo importData={importData} routerPush={push} />
                    <Export data={data} />
                    <Reset importData={importData} routerPush={push} />
                </div>
            </div>
        );
    }
}

Settings.propTypes = {
    data: PropTypes.string,
    importData: PropTypes.func.isRequired,
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
    }),
    setPageTitle: PropTypes.func
};

const mapStateToProps = (state) => {
    return {
        data: JSON.stringify(state.toJS())
    };
};

const mapDispatchToProps = mapDispatchToPropsComposer({
    importData,
});

Settings = CSSModules(Settings, styles);
Settings = connect(mapStateToProps, mapDispatchToProps)(Settings);

export default Settings;
