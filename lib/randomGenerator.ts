/**
 * Generates a random string of numbers with the specified length
 * @param length - The length of the string to generate
 * @returns A string of random digits with leading zeros if necessary
 */
export function generateRandomNumberString(length: number): string {
    if (length <= 0) {
        throw new Error('Length must be greater than 0');
    }
    
    let result = '';
    for (let i = 0; i < length; i++) {
        result += Math.floor(Math.random() * 10).toString();
    }
    
    return result;
}