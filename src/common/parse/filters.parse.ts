import {
    Between,
    FindOptionsWhere,
    ILike,
    In,
    Not,
    LessThan,
    LessThanOrEqual,
    MoreThan,
    MoreThanOrEqual,
} from 'typeorm';

type FilterOperators =
    | 'gte'
    | 'lte'
    | 'gt'
    | 'lt'
    | 'between'
    | 'in'
    | 'notIn'
    | 'contains';

interface FiltersParseParams<T extends object> {
    query: Record<string, string | undefined>;
    defaultFilters?: FindOptionsWhere<T>;
    forbiddenKeys?: (keyof T)[];
}

export default function filtersParse<T extends object>({
    query,
    defaultFilters,
    forbiddenKeys = ['password' as keyof T],
}: FiltersParseParams<T>): FindOptionsWhere<T> {
    const filters: FindOptionsWhere<T> = {};

    Object.entries(query).forEach(([key, rawValue]) => {
        if (!rawValue) return;

        if (!key.startsWith('filter_')) return;

        const parts = key.replace(/^filter_/, '').split('_');
        const field = parts[0] as keyof T;
        const op = (parts[1] as FilterOperators) || undefined;

        if (forbiddenKeys.includes(field)) return;

        if (!op) {
            filters[field] = rawValue as unknown as FindOptionsWhere<T>[keyof T];
            return;
        }

        switch (op) {
            case 'contains':
                filters[field] = ILike(`%${rawValue}%`) as FindOptionsWhere<T>[keyof T];
                break;
            case 'gte':
                filters[field] = MoreThanOrEqual(rawValue) as FindOptionsWhere<T>[keyof T];
                break;
            case 'lte':
                filters[field] = LessThanOrEqual(rawValue) as FindOptionsWhere<T>[keyof T];
                break;
            case 'gt':
                filters[field] = MoreThan(rawValue) as FindOptionsWhere<T>[keyof T];
                break;
            case 'lt':
                filters[field] = LessThan(rawValue) as FindOptionsWhere<T>[keyof T];
                break;
            case 'between': {
                const [from, to] = rawValue.split(',');
                if (!from || !to) return;
                filters[field] = Between(from, to) as FindOptionsWhere<T>[keyof T];
                break;
            }
            case 'in': {
                const arr = rawValue.split(',').filter(Boolean);
                if (!arr.length) return;
                filters[field] = In(arr) as FindOptionsWhere<T>[keyof T];
                break;
            }
            case 'notIn': {
                const arr = rawValue.split(',').filter(Boolean);
                if (!arr.length) return;
                filters[field] = Not(In(arr)) as FindOptionsWhere<T>[keyof T];
                break;
            }
        }
    });

    return defaultFilters ? { ...defaultFilters, ...filters } : filters;
}
