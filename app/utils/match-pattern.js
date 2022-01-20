export default function matchPattern(string, pattern) {
    string = string.toLowerCase();

    pattern = pattern.toLowerCase();
    pattern = pattern.replace('*', '.*');
    pattern = '^' + pattern + '$';

    return new RegExp(pattern).test(string);
}
