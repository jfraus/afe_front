import { ModelColor } from './ModelColor';
import { ModelType } from './ModelType'
import { Plant } from './Plant';

export interface Model{
    id: number,
    code?: string,
    description?: string,
    type?: ModelType,
    plant?: Plant,
    color?: ModelColor
}

 