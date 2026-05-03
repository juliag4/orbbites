export const AddStyle = (css) => {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
};
