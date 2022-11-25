
export const UserData = () => {
    let localStorageData = localStorage.getItem("Score") || 0;
    SetScore(localStorageData)
    return JSON.parse(localStorageData);
}

export const SetScore = (score) => {
    localStorage.setItem("Score", score)
}

export const setStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value))
}


export const getStaorage = (key) => {
    let localStorageData = localStorage.getItem(key) || null;
    // setStorage(key, localStorageData)
    return JSON.parse(localStorageData);
}