export default function transitionEnd(element, callback) {
    function end() {
        if (!finished) {
            finished = true;
            element.removeEventListener('transitionend', end);
            callback();
        }
    }

    let finished = false;

    // Listen for end of css transition
    element.addEventListener('transitionend', end);

    // Fallback after 5 seconds in case transition end doesn't fire
    setTimeout(() => {
        end();
    }, 5000);
}
