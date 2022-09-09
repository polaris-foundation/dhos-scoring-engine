function valueIsDefined<T>(value: T | '' | undefined): value is T {
    return (typeof value !== 'undefined' && value !== '');
}

export default valueIsDefined;
