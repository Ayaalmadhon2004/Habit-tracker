/**@param total
/**@param completed
/**@returns
*/
export const calculateProgress = (total: number, completed: number): number => {
    if(total===0) return 0;
    const percentage=(completed/total)*100;
    return Math.round(percentage);
};