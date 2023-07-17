import type { PipelineStage } from 'mongoose'

export function validatePipeline(pipeline: PipelineStage[]) {
  for (const item of pipeline) {
    //Check for forbidden methods
    if (Object.prototype.hasOwnProperty.call(item, '$out')) return { isValid: false, message: 'Forbidden aggregation method $out' }
    if (Object.prototype.hasOwnProperty.call(item, '$merge')) return { isValid: false, message: 'Forbidden aggregation method $merge' }
    //Check for sub pipelines and recurse
    const subarrays = Object.values(item).filter((item) => Array.isArray(item))
    subarrays.forEach(validatePipeline)
  }
  return { isValid: true, message: 'Pipeline is valid' }
}
