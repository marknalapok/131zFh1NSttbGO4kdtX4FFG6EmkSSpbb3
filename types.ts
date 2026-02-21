export interface Point3D {
    baseX: number;
    baseY: number;
    baseZ: number;
    x: number;
    y: number;
    z: number;
    vx: number;
    vy: number;
    vz: number;
}

export interface ProjectedPoint {
    x: number;
    y: number;
    z: number;
    scale: number;
}

export type Connection = [number, number];

export enum ColorShiftMode {
    CYAN_MAGENTA = 0,
    LIME_TEAL = 1,
    PURPLE_BLUE = 2
}