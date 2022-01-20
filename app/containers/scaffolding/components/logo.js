// Modules
import React, { PropTypes } from 'react';

// Utils
import uniqueId from 'utils/unique-id';

export default function Logo({size = 100}) {
    let id = uniqueId();

    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 100 100" role="img" aria-labelledby={id}>
            <title id={id}>Doubloon</title>
            <defs>
                <linearGradient id="svgDoubloonGradient">
                    <stop offset="0" style={{stopColor: '#ff335f'}} />
                    <stop offset="1" style={{stopColor: '#ad2361'}} />
                </linearGradient>
            </defs>
            <circle fill="#2d3345" cx="50" cy="50" r="50" />
            <path fill="url(#svgDoubloonGradient)" d="M73.648 53.627c3.71-3.477 5.906-7.798 5.906-12.48v-5.418c0 11.488-13.17 20.803-29.5 20.803s-29.5-9.314-29.5-20.804v5.416c0 11.49 13.17 20.803 29.5 20.803 8.427 0 16-2.48 21.382-6.462-4.446 7.527-15.004 12.82-27.313 12.82-16.33 0-29.57-9.314-29.57-20.805v5.417c0 4.683 2.198 9.004 5.906 12.48.53 11.164 13.545 20.1 29.54 20.1 16.33 0 29.557-9.313 29.557-20.803V59.28c0 11.49-13.227 20.804-29.557 20.804-12.31 0-22.854-5.293-27.3-12.82 5.383 3.98 12.984 6.46 21.413 6.46 15.992 0 29.007-8.935 29.535-20.097z" />
        </svg>
    );
}

Logo.propTypes = {
    size: PropTypes.number
};
