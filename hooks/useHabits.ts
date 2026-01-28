import { useCallback, useEffect, useRef, useState } from "react";
import { Habit } from "../types/habit";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
    setHabits(habits =>
      habits.map(h =>
        h.id === id
          ? { ...h, completedToday: !h.completedToday }
          : h
      )
    );
  },[]);

  const addHabit=useCallback((title:string)=>{
    const newHabits:Habit={
      id: crypto.randomUUID?.() || Date.now().toString(),
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

  return { habits, toggleHabit, addHabit ,isLoading, clearHabits};
}
