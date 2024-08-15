/* 충돌 카테고리란?
각 객체에 특정한 카테고리 값을 할당하여 충돌 필터링
특정 카테고리와 다른 카테고리 간의 충돌 가능성을 제어
비트마스크로 작동하기 때문에 카테고리 값은 반드시 2의 거듭제곱이어야 한다.
만약 2의 거듭제곱이 아닌 다른 수로 카테고리를 설정할 경우, 원하는 것과 다른 동작을 할 수 있음
*/


export const PLAYER_CATEGORY = 0x0001;            // 1
export const MONSTER_CATEGORY = 0x0002;           // 2
export const TILE_CATEGORY = 0x0004;              // 4
export const OBJECT_CATEGORY = 0x0008;            // 8
export const PLAYER_ATTACK_CATEGORY = 0x0010;     // 16 (2^4)
export const MONSTER_ATTACK_CATEGORY = 0x0020;    // 32 (2^5)
export const SENSOR_CATEGORY = 0x0040;            // 64 (2^6)
export const BOUNDARY_CATEGORY = 0x0080;          // 128 (2^7)

/* 충돌 그룹이란?
특정 객체 간의 충돌 여부를 보다 강력하게 제어
음수, 0 또는 양수로 설정
같은 양수 그룹에 속한 객체들은 서로 항상 충돌하고, 같은 음수 그룹에 속한 객체들은 절대 충돌하지 않는다.
*/

export const MONSTER_GROUP = -1;
export const PLAYER_ATTACK_GROUP = -2;
export const MONSTER_ATTACK_GROUP = -3;