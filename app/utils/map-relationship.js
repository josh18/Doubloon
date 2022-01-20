/*

main = [
    {
        id: 1,
        name: 'mainExample'
    }
];

related = [
    {
        id: 100,
        name: 'relatedExample'
    }
];

relationship = [
    list: {
        mainIdName: 1,
        relatedIdName: 100
    },
    mainId: 'mainIdName',
    relatedId: 'relatedIdName',
    type: 'multiple'
];

name = 'relatedItems';

--->>

main = [
    {
        id: 1,
        name: 'example'
        relatedItems: [
            {
                id: 100,
                name: 'relatedExample'
            }
        ]
    }
];

*/

export default function mapRelationship({main, related, relationship, name}) {
    function mapItem(mainItem) {
        if (relationship.type === 'single') {
            mainItem[name] = null;
        } else {
            mainItem[name] = [];
        }

        relationship.list.forEach(({[relationship.mainId]: mainId, [relationship.relatedId]: relatedId}) => {
            if (mainId === mainItem.id && related[relatedId]) {
                if (relationship.type === 'single') {
                    mainItem[name] = related[relatedId];
                } else {
                    mainItem[name].push(related[relatedId]);
                }
            }
        });

        return mainItem;
    }

    if (Array.isArray(main)) {
        main = main.map(mapItem);
    } else {
        Object.entries(main).forEach(([key, value]) => {
            main[key] = mapItem(value);
        });
    }

    return main;
}
