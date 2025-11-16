import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { format } from 'date-fns';
import { Item, Todo, Event, Routine, Note } from '../types';
import { parseInput } from '../utils/parser';

interface AppState {
  // Data
  items: Item[];

  // Actions
  addItem: (input: string, parentId?: string | null, depthLevel?: number) => string;
  updateItem: (id: string, updates: Partial<Item>) => void;
  deleteItem: (id: string) => void;
  toggleTodoComplete: (id: string) => void;

  // Computed - get items grouped by date
  getItemsByDate: () => Map<string, Item[]>;
  getScheduledItemsByDate: () => Map<string, Item[]>;
  getAllDatesWithItems: () => string[];
}

const generateId = () => Math.random().toString(36).substring(2, 11);

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (input: string, parentId: string | null = null, depthLevel: number = 0) => {
        const parsed = parseInput(input);
        const now = new Date();
        const createdDate = format(now, 'yyyy-MM-dd');

        const newId = generateId();

        const baseItem = {
          id: newId,
          userId: 'user-1',
          content: parsed.content,
          tags: parsed.tags,
          createdAt: now,
          createdDate,
          updatedAt: now,
          completedAt: null,
          cancelledAt: null,
        };

        // Set parent relationship
        const parentType = parentId ? (get().items.find(i => i.id === parentId)?.type as 'todo' | 'note' || null) : null;

        let newItem: Item;

        switch (parsed.type) {
          case 'todo':
            newItem = {
              ...baseItem,
              type: 'todo',
              scheduledTime: parsed.scheduledTime,
              deadline: parsed.deadline,
              hasTime: parsed.hasTime,
              parentId,
              parentType,
              depthLevel,
              subtasks: [],
              embeddedItems: [],
              completionLinkId: null,
            } as Todo;
            break;

          case 'event':
            newItem = {
              ...baseItem,
              type: 'event',
              startTime: parsed.scheduledTime || now,
              endTime: parsed.endTime || parsed.scheduledTime || now,
              hasTime: parsed.hasTime,
              isAllDay: !parsed.hasTime,
              splitStartId: null,
              splitEndId: null,
              embeddedItems: [],
              parentId,
              parentType,
              depthLevel,
            } as Event;
            break;

          case 'routine':
            newItem = {
              ...baseItem,
              type: 'routine',
              recurrencePattern: parsed.recurrencePattern || { frequency: 'daily', interval: 1 },
              scheduledTime: parsed.scheduledTime ? format(parsed.scheduledTime, 'HH:mm') : null,
              hasTime: parsed.hasTime,
              streak: 0,
              lastCompleted: null,
              embeddedItems: [],
              parentId,
              parentType,
              depthLevel,
            } as Routine;
            break;

          case 'note':
          default:
            newItem = {
              ...baseItem,
              type: 'note',
              linkPreviews: [],
              subItems: [],
              parentId,
              parentType,
              depthLevel,
              orderIndex: 0,
            } as Note;
            break;
        }

        // Handle event auto-splitting for todos scheduled during events
        if (parsed.type === 'todo' && parsed.scheduledTime && parsed.hasTime) {
          const todoTime = new Date(parsed.scheduledTime);
          const eventsToSplit: Event[] = [];

          // Find events that overlap with this todo
          get().items.forEach(item => {
            if (item.type === 'event') {
              const event = item as Event;
              const eventStart = new Date(event.startTime);
              const eventEnd = new Date(event.endTime);

              // Check if todo time is within event time range
              if (todoTime > eventStart && todoTime < eventEnd) {
                eventsToSplit.push(event);
              }
            }
          });

          // Split overlapping events
          if (eventsToSplit.length > 0) {
            set((state) => {
              let updatedItems = [...state.items];

              eventsToSplit.forEach(eventToSplit => {
                const eventStart = new Date(eventToSplit.startTime);
                const eventEnd = new Date(eventToSplit.endTime);

                // Create first part (before todo)
                const beforeId = generateId();
                const beforeEvent: Event = {
                  ...eventToSplit,
                  id: beforeId,
                  startTime: eventStart,
                  endTime: todoTime,
                  splitStartId: null,
                  splitEndId: newId, // Points to the todo that split it
                  createdAt: now,
                  updatedAt: now,
                };

                // Create second part (after todo)
                const afterId = generateId();
                const afterEvent: Event = {
                  ...eventToSplit,
                  id: afterId,
                  startTime: todoTime,
                  endTime: eventEnd,
                  splitStartId: newId, // Points to the todo that split it
                  splitEndId: null,
                  createdAt: now,
                  updatedAt: now,
                };

                // Remove original event and add split parts
                updatedItems = updatedItems.filter(item => item.id !== eventToSplit.id);
                updatedItems.push(beforeEvent, afterEvent);
              });

              // Add the new todo
              updatedItems.push(newItem);

              return { items: updatedItems };
            });

            return newId;
          }
        }

        // Update parent item to include this sub-item
        if (parentId) {
          set((state) => ({
            items: [
              ...state.items.map(item => {
                if (item.id === parentId) {
                  if (item.type === 'note') {
                    return { ...item, subItems: [...item.subItems, newId] };
                  } else if (item.type === 'todo') {
                    return { ...item, subtasks: [...item.subtasks, newId] };
                  }
                }
                return item;
              }),
              newItem
            ],
          }));
        } else {
          set((state) => ({
            items: [...state.items, newItem],
          }));
        }

        return newId;
      },

      updateItem: (id: string, updates: Partial<Item>) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...updates, updatedAt: new Date() } as Item : item
          ),
        }));
      },

      deleteItem: (id: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      toggleTodoComplete: (id: string) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id === id && item.type === 'todo') {
              const todo = item as Todo;
              return {
                ...todo,
                completedAt: todo.completedAt ? null : new Date(),
                updatedAt: new Date(),
              };
            }
            return item;
          }),
        }));
      },

      getItemsByDate: () => {
        const itemsByDate = new Map<string, Item[]>();
        const items = get().items;

        items.forEach((item) => {
          const date = item.createdDate;
          if (!itemsByDate.has(date)) {
            itemsByDate.set(date, []);
          }
          itemsByDate.get(date)!.push(item);
        });

        return itemsByDate;
      },

      getScheduledItemsByDate: () => {
        const itemsByDate = new Map<string, Item[]>();
        const items = get().items;

        items.forEach((item) => {
          let dateKey: string | null = null;

          if (item.type === 'todo') {
            const todo = item as Todo;
            if (todo.scheduledTime) {
              dateKey = format(new Date(todo.scheduledTime), 'yyyy-MM-dd');
            }
          } else if (item.type === 'event') {
            const event = item as Event;
            dateKey = format(new Date(event.startTime), 'yyyy-MM-dd');
          }

          if (dateKey) {
            if (!itemsByDate.has(dateKey)) {
              itemsByDate.set(dateKey, []);
            }
            itemsByDate.get(dateKey)!.push(item);
          }
        });

        return itemsByDate;
      },

      getAllDatesWithItems: () => {
        const dates = new Set<string>();
        const items = get().items;

        // Get all created dates
        items.forEach((item) => {
          dates.add(item.createdDate);
        });

        // Get all scheduled dates
        items.forEach((item) => {
          if (item.type === 'todo') {
            const todo = item as Todo;
            if (todo.scheduledTime) {
              dates.add(format(new Date(todo.scheduledTime), 'yyyy-MM-dd'));
            }
          } else if (item.type === 'event') {
            const event = item as Event;
            dates.add(format(new Date(event.startTime), 'yyyy-MM-dd'));
          }
        });

        return Array.from(dates).sort();
      },
    }),
    {
      name: 'thoughts-time-storage',
    }
  )
);
