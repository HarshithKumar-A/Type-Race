
export const UserData = () => {
    let localStorageData = localStorage.getItem("Score") || 0;
    SetScore(localStorageData)
    return JSON.parse(localStorageData);
}

export const SetScore = (score) => {
    localStorage.setItem("Score", score)
}