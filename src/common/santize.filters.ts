import { FindOptionsWhere, ILike } from 'typeorm';

interface SanitizeParams<T> {
    filters?: Record<string, any>;
    forbiddenKeys?: (keyof T)[];
}

export function sanitizeFilters<T extends object>({
    filters,
    forbiddenKeys = ['password' as keyof T],
}: SanitizeParams<T> = {}): FindOptionsWhere<T> {
    if (!filters) return {} as FindOptionsWhere<T>;

    const sanitized: Record<string, any> = {};

    const walk = (obj: Record<string, any>, target: Record<string, any>, insideOr = false) => {
        for (const rawKey of Object.keys(obj)) {
            const value = obj[rawKey];
            if (value === undefined || value === null) continue;

            // Convertir keys tipo filter[role][name] -> ['role','name']
            const path = rawKey
                .replace(/^filter\[/, '')
                .replace(/\]$/g, '')
                .split('][');

            if (forbiddenKeys.includes(path[0] as keyof T)) continue;

            let current = target;
            path.forEach((p, i) => {
                if (i === path.length - 1) {
                    // Si es 'or' y es array
                    if (p.toLowerCase() === 'or' && Array.isArray(value)) {
                        current['$or'] = value.map((v) => {
                            const temp: Record<string, any> = {};
                            walk(v, temp, true);
                            return temp;
                        });
                    } else {
                        // Si está dentro de un 'or' y es string, usar ILike
                        if (insideOr && typeof value === 'string') {
                            current[p] = ILike(`%${value}%`);
                        } else {
                            current[p] = value;
                        }
                    }
                } else {
                    current[p] ??= {};
                    current = current[p];
                }
            });
        }
    };

    walk(filters, sanitized);

    // casteamos al final como FindOptionsWhere<T>
    return sanitized as FindOptionsWhere<T>;
}
