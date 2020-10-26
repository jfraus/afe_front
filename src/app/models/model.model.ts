import { Color } from './color.model';
import { ModelType } from './model-type.model'
import { Plant } from './plant.model';

export interface Model{
    id: number,
    code?: string,
    description?: string,
    type?: ModelType,
    plant?: Plant,
    color?: Color
}

 