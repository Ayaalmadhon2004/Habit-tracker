/**@param total
/**@param completed
/**@returns
*/
// utils/habitUtils.ts
export const calculateProgress = (total: number, completed: number): number => {
  // إذا كان المجموع صفر أو أقل، النسبة دائماً صفر
  if (!total || total <= 0) {
    return 0;
  }
  
  const percentage = (completed / total) * 100;
  return Math.round(percentage); 
};