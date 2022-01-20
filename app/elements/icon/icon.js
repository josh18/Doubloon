// Modules
import React, { PropTypes } from 'react';

// Utils
import uniqueId from 'utils/unique-id';

function Edit({size = 18}) {
    let id = uniqueId();

    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 18 18" role="img" aria-labelledby={id}>
            <title id={id}>Edit</title>
            <path d="M0 14.25V18h3.75L14.81 6.94l-3.75-3.75L0 14.25zM17.708 4.043c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
        </svg>
    );
}

Edit.propTypes = {
    size: PropTypes.number
};

function Lightning({size = 20, ...props}) {
    let id = uniqueId();

    let width = size / 20 * 12;

    return (
        <svg  xmlns="http://www.w3.org/2000/svg" width={width} height={size} viewBox="0 0 12 20" role="img" aria-labelledby={id} {...props}>
            <title id={id}>Lightning</title>
            <path d="M2.623 20L12 7.7l-5.743.876-.066-.032L9.377 0 0 12.302l5.743-.878.066.03" />
        </svg>
    );
}

Lightning.propTypes = {
    size: PropTypes.number
};

function Settings({size = 20, ...props}) {
    let id = uniqueId();

    return (
        <svg  xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 19.5 20" role="img" aria-labelledby={id} {...props}>
            <title id={id}>Settings</title>
            <path d="M17.64 10.98c.044-.32.073-.64.073-.98s-.03-.66-.072-.98l2.17-1.65c.196-.15.246-.42.124-.64l-2.056-3.46c-.124-.22-.402-.3-.628-.22l-2.56 1c-.535-.4-1.11-.73-1.737-.98l-.39-2.65C12.53.18 12.315 0 12.058 0H7.945c-.257 0-.472.18-.504.42l-.39 2.65c-.627.25-1.203.59-1.738.98l-2.56-1c-.236-.09-.504 0-.627.22L.07 6.73c-.132.22-.07.49.125.64l2.17 1.65c-.042.32-.073.65-.073.98s.03.66.072.98l-2.17 1.65c-.194.15-.246.42-.123.64l2.057 3.46c.124.22.4.3.627.22l2.56-1c.534.4 1.11.73 1.737.98l.392 2.65c.032.24.247.42.504.42h4.112c.257 0 .473-.18.504-.42l.39-2.65c.63-.25 1.203-.59 1.738-.98l2.56 1c.236.09.504 0 .628-.22l2.056-3.46c.122-.22.072-.49-.123-.64l-2.17-1.65zm-7.638 2.52c-1.984 0-3.598-1.57-3.598-3.5s1.614-3.5 3.598-3.5S13.6 8.07 13.6 10s-1.614 3.5-3.598 3.5z" />
        </svg>
    );
}

Settings.propTypes = {
    size: PropTypes.number
};

function TriangleDown({size = 5, ...props}) {
    let id = uniqueId();

    let width = size / 5 * 10;

    return (
        <svg  xmlns="http://www.w3.org/2000/svg" width={width} height={size} viewBox="0 0 10 5" role="img" aria-labelledby={id} {...props}>
            <title id={id}>Arrow Down</title>
            <path d="M0 0l5 5 5-5H0z" />
        </svg>
    );
}

TriangleDown.propTypes = {
    size: PropTypes.number
};

export default function Icon({type, ...props}) {
    switch (type) {
        case 'edit': {
            return <Edit {...props} />;
        }
        case 'lightning': {
            return <Lightning {...props} />;
        }
        case 'settings': {
            return <Settings {...props} />;
        }
        case 'triangle-down': {
            return <TriangleDown {...props} />;
        }
    }

    return null;
}

Icon.propTypes = {
    type: PropTypes.oneOf(['edit', 'lightning', 'settings', 'triangle-down']),
    size: PropTypes.number
};
