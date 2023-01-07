export interface SpriteState {
    id: string,
    order: number,
    frames: number,
    loop: boolean,
};

export interface SpriteStates {
    [key: string]: SpriteState,
};

export interface Resolution {
    x: number;
    y: number;
};