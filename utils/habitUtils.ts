/**@param total
/**@param completed
/**@returns
*/

export const calculateProgress = (total: number, completed: number): number => {
  if (!total || total <= 0) {
    return 0;
  }
  
  const percentage = (completed / total) * 100;
  return Math.round(percentage); 
};

export const updateStreak=(currentStreak:number,lastCompleted?:string):number=>{
  if(!lastCompleted) return 1;

  const today=new Date();
  const lastDate=new Date(lastCompleted);

  const diffInTime=today.getTime()-lastDate.getTime();
  const diffInDays=Math.floor(diffInTime/(1000*3600*24));

  if(diffInDays===0) return currentStreak;

  if(diffInDays<=3){
    return currentStreak+1;
  }

  return 1;
}