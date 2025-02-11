import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './useAuthStore';

interface Task {
  id: string;
  title: string;
  status: 'created' | 'started' | 'completed' | 'unfinished' | 'migrated';
  created_at: string;
  user_id: string;
}

interface GoalsState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  addTask: (title: string) => Promise<void>;
  updateTaskStatus: (taskId: string, status: Task['status']) => Promise<void>;
}

export const useGoalsStore = create<GoalsState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const { user } = useAuthStore.getState();
      if (!user) {
        console.warn("useGoalsStore: No user logged in, not fetching tasks.");
        set({ tasks: [], isLoading: false, error: 'Not authenticated' });
        return;
      }

      const today = new Date().toISOString().slice(0, 10);

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', `${today}T00:00:00+00:00`)
        .lt('created_at', `${today}T23:59:59+00:00`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("useGoalsStore: Error fetching tasks:", error);
        set({ error: error.message, isLoading: false });
        return;
      }

      set({ tasks: data || [], isLoading: false, error: null });
    } catch (error: any) {
      console.error("useGoalsStore: Error in fetchTasks:", error);
      set({ error: error.message, isLoading: false });
    } finally {
      set({ isLoading: false });
    }
  },

  addTask: async (title: string) => {
    const { user } = useAuthStore.getState();

    console.log('addTask: user = ', user);
    console.log('addTask: title = ', title);

    if (!user) {
      console.warn("useGoalsStore: No user logged in, cannot add task.");
      alert('You must be logged in to add tasks.');
      set({ error: 'Not authenticated' });
      return;
    }

    try {
      const newTask = {
        title,
        user_id: user.id,
        status: 'created', // Set the default status here
      };

      console.log("useGoalsStore: Attempting to insert task with:", newTask);

      const { data, error } = await supabase
        .from('tasks')
        .insert([newTask]) // Insert as an array
        .select()
        .single();

      console.log('addTask: insert result data = ', data);
      console.log('addTask: insert result error = ', error);

      if (error) {
        console.error("useGoalsStore: Error adding task to Supabase:", error);
        alert(`Failed to add task: ${error.message}`);
        set({ error: `Supabase error: ${error.message} - ${error.details}` });
        return;
      }

      set(state => ({
        tasks: [...state.tasks, data],
        error: null,
      }));
    } catch (error: any) {
      console.error("useGoalsStore: Error in addTask:", error);
      alert(`Error adding task: ${error.message}`);
      set({ error: `Error adding task: ${error.message}` });
    }
  },

  updateTaskStatus: async (taskId: string, status: Task['status']) => {
    try {
      const { user } = useAuthStore.getState();
      if (!user) {
        console.warn("useGoalsStore: No user logged in, cannot update task status.");
        alert('You must be logged in to update tasks.');
        set({ error: 'Not authenticated' });
        return;
      }

      const { error } = await supabase
        .from('tasks')
        .update({ status })
        .eq('id', taskId)
        .eq('user_id', user.id)
        .select()

      if (error) {
        console.error(`useGoalsStore: Error updating task status to ${status} in Supabase:`, error);
        alert(`Failed to update task status: ${error.message}`);
        set({ error: error.message });
        return;
      }

      set((state) => ({
        tasks: state.tasks.map(task =>
          task.id === taskId ? { ...task, status: status } : task
        ),
        error: null,
      }));
    } catch (error: any) {
      console.error("useGoalsStore: Error in updateTaskStatus:", error);
      alert(`Error updating task status: ${error.message}`);
      set({ error: error.message });
    }
  },
}));
