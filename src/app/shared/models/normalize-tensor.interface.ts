import { Tensor, TensorLike } from "@tensorflow/tfjs";


export interface NormalizeTensor{
        tensor: Tensor | any,
        min: number,
        max: number
}