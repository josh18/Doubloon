// Modules
import React from 'react';
import ReactDOM from 'react-dom';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';

// Store
import { loadStore } from 'store';

// Language translation
import messages from 'languages/en';

// Containers
import Categories from 'containers/categories/categories';
import Overview from 'containers/overview/overview';
import Scaffolding from 'containers/scaffolding/scaffolding';
import Settings from 'containers/settings/settings';
import Transactions from 'containers/transactions/transactions';
import Vendors from 'containers/vendors/vendors';

// Elements
import Error404 from 'elements/error-404/error-404';

// Styles
import 'less/reset';
import 'less/global';

// Wrappers
import PageRoute from 'containers/scaffolding/wrappers/page-route';
import PageSwitch from 'containers/scaffolding/wrappers/page-switch';

// Render
function init(store) {
    ReactDOM.render(
        <Provider store={store}>
            <IntlProvider locale="en" messages={messages}>
                <Router>
                    <Scaffolding>
                        <PageSwitch>
                            <PageRoute path="/" exact component={Overview} />
                            <PageRoute path="/categories" component={Categories} />
                            <PageRoute path="/transactions" component={Transactions} />
                            <PageRoute path="/vendors" component={Vendors} />
                            <PageRoute path="/settings" exact component={Settings} />
                            <Route component={Error404} />
                        </PageSwitch>
                    </Scaffolding>
                </Router>
            </IntlProvider>
        </Provider>,
        document.getElementById('app')
    );
}

loadStore(init);

if (!process.env.NODE_ENV && module.hot) {
    module.hot.accept();
}
