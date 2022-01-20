const fs = require('fs');

const blueprint = {
    random: [
        {
            name: 'Groceries',
            chance: 50,
            vendor: ['Pak\'n\'Save', 'Countdown'],
            value: [-10, -50],
            cents: true
        }, {
            name: 'Petrol',
            chance: 7,
            vendor: ['BP', 'Caltex'],
            value: [-30, -50]
        }, {
            name: 'Food',
            chance: 17,
            vendor: ['McDonalds', 'Andrews Ale House', 'Cafe Complex'],
            value: [-2, -10],
            cents: true
        }, {
            name: 'Fun',
            chance: 7,
            vendor: ['Paintball', 'Downtown Cinemas', 'Whitcoulls', 'Toy World'],
            value: [-10, -50],
            cents: true
        }, {
            name: 'Presents',
            chance: 7,
            vendor: ['Kmart', 'Bunnings'],
            value: [-10, -70],
            cents: true
        }, {
            name: 'Clothes',
            chance: 2,
            vendor: ['Farmers', 'Kmart'],
            value: [-20, -80],
            cents: true
        }, {
            name: 'Furniture',
            chance: 2,
            vendor: 'Farmers',
            value: [-20, -120],
            cents: true
        }, {
            name: 'General Expenses',
            chance: 2,
            vendor: ['Super Shop', 'Mighty Mart', 'Wondeful Wares'],
            value: [-5, -30]
        }
    ],
    scheduled: [
        {
            name: 'Mortgage',
            vendor: 'Westpac',
            repeating: 'fortnightly',
            day: 5,
            value: -520
        }, {
            name: 'Income',
            vendor: 'Serenity',
            repeating: 'weekly',
            day: 4,
            value: 725
        }, {
            name: 'Power',
            vendor: 'Powershop',
            repeating: 'monthly',
            day: 15,
            value: [-90, -150]
        }, {
            name: 'Internet',
            vendor: 'Vodafone',
            repeating: 'monthly',
            day: 10,
            value: -79
        }, {
            name: 'Cellphone',
            vendor: 'Spark',
            repeating: 'monthly',
            day: 21,
            value: -19
        }, {
            name: 'Insurance',
            vendor: 'AMI',
            repeating: 'monthly',
            day: 1,
            value: -75
        }
    ]
};

function convertToDate(date) {
    date = date.split('/');

    let day = Number(date[0]);
    let month = Number(date[1]) - 1;
    let year = Number(date[2]);

    return new Date(Date.UTC(year, month, day));
}

function roll(value) {
    return Math.random() * 100 < value;
}

function getDate(date) {
    return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
}

function getValue(value, cents) {
    if (typeof value === 'object') {
        let [min, max] = value.sort((a, b) => a - b);
        value = Math.floor(Math.random() * (max - min + 1)) + min;
    }

    if (cents) {
        value = value + (Math.round(Math.random() * 100) / 100);
        value = value.toFixed(2);
    }

    return value;
}

function getVendor(vendor) {
    if (typeof vendor === 'object') {
        vendor = vendor[Math.floor(Math.random() * vendor.length)];
    }

    return vendor;
}

function getCode1() {
    return Math.floor(Math.random() * 10000000);
}

function getCode2() {
    let letters = 'abcdefghijklmnopqrstuvwxyz';

    let first = Math.floor(Math.random() * 1000);
    first = first.toString();
    while (first.length <= 4) {
        first = '0' + first;
    }

    let last = '';
    while (last.length <= 4) {
        last += letters[Math.floor(Math.random() * 26)];
    }

    return first + '-' + last;
}

let startDate = convertToDate('01/01/2015');
let endDate = convertToDate('31/12/2017');

let csv = [
    [
        'Date',
        'Amount',
        'Other Party',
        'Description',
        'Reference',
        'Particulars',
        'Analysis Code'
    ]
];

let fortnightly = false;
let currentDate = startDate;
while (currentDate < endDate) {
    if (currentDate.getDate() === 0) {
        fortnightly = !fortnightly;
    }

    blueprint.random.forEach(({name, chance, vendor, value, cents, method}) => {
        if (roll(chance)) {
            let date = getDate(currentDate);
            value = getValue(value, cents);
            vendor = getVendor(vendor);

            csv.push([
                date,
                value,
                vendor,
                method,
                name,
                getCode1(),
                getCode2()
            ]);
        }
    });

    blueprint.scheduled.forEach(({name, vendor, repeating, day, value, cents, method}) => {
        if (
            (repeating === 'weekly' && day === currentDate.getDay()) || // weekly
            (repeating === 'fortnightly' && day === currentDate.getDay() && fortnightly) || // fortnightly
            (repeating === 'monthly' && currentDate.getDate() === day) // monthly
        ) {
            let date = getDate(currentDate);
            value = getValue(value, cents);
            vendor = getVendor(vendor);

            csv.push([
                date,
                value,
                vendor,
                method,
                name,
                getCode1(),
                getCode2()
            ]);
        }
    });

    var nextDate = currentDate.setDate(currentDate.getDate() + 1);
    currentDate = new Date(nextDate);
}

csv = csv.map((row) => row.join(','));
csv = csv.join('\n');
fs.writeFile('./files/transactions.csv', csv, 'utf8', (error) => {
    if (error) {
        console.log(error);
    } else {
        console.log('Transactions generated!');
    }
});
