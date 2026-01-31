import { useCallback, useEffect, useRef, useState } from "react";
import { Habit } from "../types/habit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateStreak } from "@/utils/habitUtils";

const HABITS_STORAGE_KEY="@habits";

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading,setIsLoading]=useState<boolean>(true);
  const isInitialMount=useRef(true);

  useEffect(()=>{
    const loadHabits=async()=>{
      try{
        const stored=await AsyncStorage.getItem(HABITS_STORAGE_KEY);
        if(stored){
          setHabits(JSON.parse(stored));
        }
      }catch(e){
        console.error("Failed to load habits",e);
      }
      finally{
        setIsLoading(false);
      }
    }
    loadHabits();
  },[]);

  useEffect(()=>{
    if(isInitialMount.current){
      isInitialMount.current=false;
      return;
    }
    const saveHabits=async()=>{
      try{
        await AsyncStorage.setItem(HABITS_STORAGE_KEY,JSON.stringify(habits));
      } catch(e){
        console.error("Failed to save habits",e);
      }   
    };
    if(!isLoading){
      saveHabits();
    }
  },[habits,isLoading]);

  const toggleHabit = useCallback((id: string) => {
    setHabits(prevHabits=>prevHabits.map(habit=>{
      if(habit.id===id){
        const isCompleting=!habit.completedToday;
        let newStreak=habit.streak;
        let newLastCompleted=habit.lastCompleted;

        if(isCompleting){
          newStreak=updateStreak(habit.streak,habit.lastCompleted);
          newLastCompleted=new Date().toISOString();
        }
        return{
          ...habit,
          completedToday:isCompleting,
          streak:newStreak,
          lastCompleted:newLastCompleted
        };
      }
      return habit;
    }))
  },[]);

  const addHabit=useCallback((title:string)=>{
    const newHabits:Habit={
      id:Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      title,
      completedToday:false
    }
    setHabits(prev=>[...prev,newHabits]);
  },[]);

  const clearHabits=useCallback(async()=>{
      try{
        await AsyncStorage.removeItem(HABITS_STORAGE_KEY);
        setHabits([]);
      }catch(e){
        console.error("Failed to clear Habit",e);
      }
  },[]);

  const deleteHabit=useCallback((id:string)=>{
    setHabits(prev=>prev.filter(habit=>habit.id!==id));
  },[])

  const updateHabit=useCallback((id:string,newTitle:string)=>{
    setHabits(prev=>prev.map(h=>h.id===id ? {...h,title:newTitle} : h));
  },[])

  return { habits, toggleHabit, addHabit ,isLoading, clearHabits, deleteHabit , updateHabit};
}
