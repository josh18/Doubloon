// Modules
import React, { Component, PropTypes } from 'react';

// Wrappers
import CSSModules from 'wrappers/css-modules';

// Elements
import Select from 'elements/select/select';

// Utils
import { formatMonth } from 'utils/format';

// Styles
import styles from '../styles.less';

class Filter extends Component {
    onSelectChange = (select) => {
        let {
            month,
            routerPush,
            year
        } = this.props;

        if (select.name === 'month') {
            month = select.value;
        } else if (select.name === 'year') {
            year = select.value;
        }

        // 0-11 --> 1-12
        month++;

        // Prefix with 0 if necessary
        month = month.toString();
        if (month.length === 1) {
            month = '0' + month;
        }

        routerPush(`/transactions/${year}/${month}`);
    }

    render() {
        let {
            maxYear,
            minYear,
            month,
            year
        } = this.props;

        let monthOptions = [];
        for (let currentMonth = 0; currentMonth <= 11; currentMonth++) {
            monthOptions.push({
                name: formatMonth(currentMonth),
                value: currentMonth
            });
        }

        let yearOptions = [];
        for (let currentYear = minYear; currentYear <= maxYear; currentYear++) {
            yearOptions.push({
                name: currentYear,
                value: currentYear
            });
        }

        return (
            <div styleName="filter">
                <Select styleName="filter-select" name="month" value={month} onChange={this.onSelectChange} options={monthOptions} alignDropdown="right" aria-label="Transactions filter by month" />
                <Select styleName="filter-select" name="year" value={year} onChange={this.onSelectChange} options={yearOptions} alignDropdown="right" aria-label="Transactions filter by year" />
            </div>
        );
    }
}

Filter.propTypes = {
    maxYear: PropTypes.number.isRequired,
    minYear: PropTypes.number.isRequired,
    month: PropTypes.number.isRequired,
    routerPush: PropTypes.func.isRequired,
    year: PropTypes.number.isRequired
};

Filter = CSSModules(Filter, styles);

export default Filter;
