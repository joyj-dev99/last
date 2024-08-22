export function saveCoinsToLocalStorage(coins) {
    localStorage.setItem('playerCoins', coins);
}

export function loadCoinsFromLocalStorage() {
    const storedCoins = localStorage.getItem('playerCoins');
    return storedCoins ? parseInt(storedCoins, 10) : 0;  // 저장된 코인이 없으면 0으로 초기화
}