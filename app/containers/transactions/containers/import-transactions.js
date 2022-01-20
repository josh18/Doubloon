// Modules
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Papa from 'papaparse';

// Elements
import Button from 'elements/button/button';

// Utils
import mapDispatchToPropsComposer from 'utils/map-dispatch-to-props';
import matchPattern from 'utils/match-pattern';

// Actions
import { importTransactions } from '../actions';

// Selectors
import { selectTransactions } from '../selectors';
import { selectVendors } from 'containers/vendors/selectors';

class ImportTransactions extends Component {
    chooseFile = (e) => {
        this.inputElement.click();
        e.preventDefault();
    }

    inputUpload = () => {
        if (this.inputElement.files) {
            const reader = new FileReader();
            reader.readAsText(this.inputElement.files[0]);
            reader.onload = (e) => {
                this.parseData(e.target.result);
                this.inputElement.value = '';
            };
        }
    }

    parseData = (data) => {
        let {
            importTransactions,
            transactions,
            vendors
        } = this.props;

        data = Papa.parse(data, {
            header: true,
            skipEmptyLines: true,
            error: () => {
                console.error('Unable to parse the CSV.');
            }
        }).data;

        let newTransactionId = transactions.reduce((maxId, transaction) => {
            return Math.max(transaction.id, maxId);
        }, 0) + 1;

        let newVendors = [];
        let newVendorId = vendors.reduce((maxId, vendor) => {
            return Math.max(vendor.id, maxId);
        }, 0) + 1;

        let categoryTransactionRelationships = [];
        let transactionVendorRelationships = [];

        let newTransactions = data.map((originalLine) => {
            let line = {};
            Object.entries(originalLine).forEach(([key, value]) => {
                line[key.toLowerCase()] = value;
            });

            // Convert date to timestamp
            let date = line.date.split('/');
            date = new Date(date[2], date[1] - 1, date[0]).valueOf();

            let transaction = {
                amount: parseFloat(line.amount),
                date: date,
                description: line.description,
                id: newTransactionId.toString(),
                name: line['other party'],
                reference: [
                    line.reference,
                    line.particulars,
                    line['analysis code']
                ].filter(Boolean).join(' | ')
            };

            let relationship = {
                transactionId: transaction.id,
            };

            // Match existing vendor
            vendors.forEach((vendor) => {
                if (matchPattern(transaction.name, vendor.pattern)) {
                    relationship.vendorId = vendor.id;

                    // Assign vendor categories to new transaction
                    vendor.categories.forEach((categoryId) => {
                        categoryTransactionRelationships.push({
                            categoryId,
                            transactionId: transaction.id
                        });
                    });
                }
            });

            // Match new pattern
            if (!relationship.vendorId) {
                newVendors.forEach((vendor) => {
                    if (matchPattern(transaction.name, vendor.pattern)) {
                        relationship.vendorId = vendor.id;
                    }
                });
            }

            // Create vendor
            if (!relationship.vendorId) {
                newVendors.push({
                    autoCategorise: false,
                    id: newVendorId.toString(),
                    name: transaction.name,
                    pattern: transaction.name.toLowerCase()
                });
                relationship.vendorId = newVendorId.toString();

                newVendorId++;
            }

            transactionVendorRelationships.push(relationship);

            newTransactionId++;

            return transaction;
        });

        importTransactions(newTransactions, newVendors, categoryTransactionRelationships, transactionVendorRelationships);
    }

    render() {
        let { className } = this.props;

        return (
            <div>
                <input onChange={this.inputUpload} style={{ display: 'none' }} type="file" ref={element => this.inputElement = element} />
                <Button onClick={this.chooseFile} className={className}>
                    Import transactions
                </Button>
            </div>
        );
    }
}

ImportTransactions.propTypes = {
    className: PropTypes.string,
    importTransactions: PropTypes.func.isRequired,
    transactions: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
        })
    ).isRequired,
    vendors: PropTypes.arrayOf(
        PropTypes.shape({
            categories: PropTypes.arrayOf(
                PropTypes.string.isRequired,
            ).isRequired,
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            pattern: PropTypes.string.isRequired
        })
    ).isRequired
};

const mapStateToProps = createStructuredSelector({
    transactions: selectTransactions,
    vendors: selectVendors
});

const mapDispatchToProps = mapDispatchToPropsComposer({
    importTransactions
});

ImportTransactions = connect(mapStateToProps, mapDispatchToProps)(ImportTransactions);

export default ImportTransactions;
