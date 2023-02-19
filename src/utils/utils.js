/**
 * 
 * @param {KeyboardEvent} event 
 * @returns {string}
 */
export const keyUp = (event) => {
    switch (event.code) {
        case 'ArrowLeft':
        case 'KeyA':
            return 'left'
        case 'ArrowRight':
        case 'KeyD':
            return 'right'
    }
};

/**
 * 
 * @param {KeyboardEvent} event 
 * @returns {string}
 */
export const keyDown = (event) => {
    switch (event.code) {
        case 'ArrowLeft':
        case 'KeyA':
            return 'left'
        case 'ArrowRight':
        case 'KeyD':
            return 'right'
    }

};

/**
 * 
 * @param {number} max 
 * @param {number} min 
 * @returns 
 */
export const getBallXPosition = (max, min) => {
    const mul = Math.random() <= 0.5 ? 1 : -1
    return Math.floor(Math.random() * (max - min + 1) + min) * mul
}

/**
 * 
 * @param {number} max 
 * @param {number} min 
 * @returns 
 */
export const getRandNum = (max, min) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * 
 * @returns {string} good_ball or bad_ball
 */
export const isGood = () => {
    return Math.random() <= 0.5 ? 'good_ball' : 'bad_ball'
}