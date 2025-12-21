export const delay = (ms = 700) =>
    new Promise(resolve => setTimeout(resolve, ms));
