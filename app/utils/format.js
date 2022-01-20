import React from 'react';

export function formatDate(date, stringOnly) {
    // Check if argument is already a date object
    if (!(date instanceof Date)) {
        date = new Date(date);
    }

    let day = date.getDate();
    let month = date.toLocaleDateString('en-nz', {
        month: 'short'
    });
    let year = date.getFullYear();

    if (stringOnly) {
        return day + ' ' + month + ' ' + year;
    }

    return (
        <span>
            <strong>{day} {month}</strong> {year}
        </span>
    );
}

export function formatMonth(month) {
    let date = new Date();
    date.setDate(1);
    date.setMonth(month);

    return date.toLocaleDateString('en-nz', {
        month: 'long'
    });
}

export function formatCurrency(number) {
    var formatter = new Intl.NumberFormat('en-nz', {
        style: 'currency',
        currency: 'NZD',
        minimumFractionDigits: 2,
    });

    return formatter.format(number);
}
