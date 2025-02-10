import React, { useState, useEffect, useRef } from 'react';
import { Check, Play, Loader2, Circle } from 'lucide-react';
import { ViewGoalToday } from './ui/ViewGoalToday';
import { useGoalsStore } from '../store/useGoalsStore';
import { motion } from 'framer-motion';
import { ViewGoals } from './ui/ViewGoals';
import { NewGoalFormBullet } from './ui/NewGoalFormBulltet';

export function DashboardGoal() {
  const [newTask, setNewTask] = useState('');
  const [taskError, setTaskError] = useState('');
  const taskItemRefs = useRef<HTMLElement[]>([]);
  const { tasks, addTask, updateTaskStatus, fetchTasks } = useGoalsStore();
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [showTick, setShowTick] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        setIsScrolled(scrollContainerRef.current.scrollTop > 0);
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setIsLoadingTasks(true);
    setTaskError('');
    try {
      await fetchTasks();
    } catch (error) {
      console.error('DashboardPage: Error fetching tasks:', error);
      setTaskError('Failed to load tasks:', error);
    } finally {
      setIsLoadingTasks(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setTaskError('');
    if (newTask.trim()) {
      try {
        await addTask(newTask);
        setNewTask('');
        setShowTick(true);
        setTimeout(() => {
          setShowTick(false);
        }, 700);
        await loadTasks(); // Reload tasks after adding a new one
      } catch (error) {
        console.error('DashboardPage: Failed to add task:', error);
        setTaskError('Failed to add task:', error);
      }
    } else {
      setTaskError('This cannot be empty.');
    }
  };

  const handleStartTask = async (taskId: string, index: number) => {
    try {
      await updateTaskStatus(taskId, 'started');
    } catch (error) {
      console.error('DashboardPage: Failed to add task:', error);
      setTaskError('Failed to start task:', error);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      await updateTaskStatus(taskId, 'completed');
    } catch (error) {
      console.error('DashboardPage: Failed to complete task:', error);
    }
  };

  return (
    <div className="p-4 w-full">
      <main
        className="mx-auto bg-gray-100 rounded-xl flex flex-col"
        style={{ maxWidth: '600px', width: '100%' }}
      >
        <div className={`flex justify-between border-b-2 p-2 sticky top-0 bg-gray-100 z-10 ${isScrolled ? 'shadow-sm' : ''}`}>
          <h2 className="text-xl text-left font-semibold text-gray-800">Goals</h2>
        </div>

        <div className="overflow-y-auto pt-2" style={{ maxHeight: 'calc(100vh - 12rem - 16rem - 3.25rem - 6rem)' }} ref={scrollContainerRef}>
          <ViewGoals
            isLoadingTasks={isLoadingTasks}
            tasks={tasks}
            handleCompleteTask={handleCompleteTask}
            handleStartTask={handleStartTask}
            taskItemRefs={taskItemRefs}
          />
        </div>
        <div className={`sticky bottom-0 bg-gray-100 p-2 z-10 ${isScrolled ? 'shadow-sm' : ''}`}>
          <NewGoalFormBullet handleAddTask={handleAddTask} />
        </div>
      </main>
    </div>
  );
}
