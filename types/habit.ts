export interface Habit{
    id:string;
    title:string;
    completedToday:boolean;
    streak?:number;
    lastCompleted?:string;
}