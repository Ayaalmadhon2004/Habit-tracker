export interface Category{
    id:string;
    name:string;
    color:string;
}

export interface Habit{
    id:string;
    title:string;
    completedToday:boolean;
    streak?:number;
    lastCompleted?:string;
    completedDates: string[];
    categoryId: string;
}