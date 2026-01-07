import { FindOptionsRelations } from 'typeorm';

type NestedRelations<T> = {
    [K in keyof T]?: T[K] extends object ? NestedRelations<T[K]> | true : true;
};

function isKeyOf<T extends object>(key: string, obj: T): key is keyof T & string {
    return key in obj;
}

export function parsePopulate<T extends object>(
    query: Record<string, unknown>,
    validRelations: (keyof T & string)[] = [],
    entityExample?: T
): FindOptionsRelations<T> | undefined {
    const relations: NestedRelations<T> = {};

    Object.keys(query).forEach((rawKey) => {
        if (!rawKey.startsWith('populate[')) return;

        const value = query[rawKey];
        if (value !== 'true') return;

        const path = rawKey
            .replace(/^populate\[/, '')
            .replace(/\]$/g, '')
            .split('][');

        if (validRelations.length && !validRelations.includes(path[0] as keyof T & string)) {
            return;
        }

        let current: NestedRelations<T> = relations;
        let currentType = entityExample ?? {} as T;

        for (let i = 0; i < path.length; i++) {
            const p = path[i];


            if (entityExample && !isKeyOf(p, currentType)) return;

            if (i === path.length - 1) {
                current[p] = true;
            } else {
                if (!current[p] || current[p] === true) {
                    current[p] = {};
                }
                current = current[p];
                if (entityExample) currentType = currentType[p];
            }
        }
    });

    return Object.keys(relations).length
        ? (relations as FindOptionsRelations<T>)
        : undefined;
}
