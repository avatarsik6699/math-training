import { lib } from "./../../../shared/lib/index";
import { createEffect, createEvent, createStore, sample } from "effector";
import { TodoListTypes } from "../todo-list.types";

const todosSample: TodoListTypes.$Todos = Array.from({ length: Math.round(Math.random() * 10 + 1) }).map((_, idx) => ({
  id: String(idx + 1),
  status: "in-work",
  text: lib.string.getRandomString(10),
}));

const fakeRequest = async () => {
  const value = Math.round(Math.random() * 10 + 1);

  return new Promise<TodoListTypes.$Todos | undefined>((res, rej) => {
    setTimeout(() => {
      if (value <= 3) {
        res(todosSample);
      } else if (value > 3 && value <= 6) {
        rej("Произошла ошибка");
      } else {
        res(undefined);
      }
    }, 1500);
  });
};

const createTodosM = (initial: TodoListTypes.$Todos) => {
  const todosFx = createEffect(async () => {
    const response = await fakeRequest();

    return response;
  });

  const addFn = createEvent<string>();
  const resetFn = createEvent<void>();

  const submitFn = createEvent<React.SyntheticEvent>();
  const changeFn = createEvent<string>();
  const $input = createStore("")
    .on(changeFn, (_, value) => value)
    .reset(addFn, resetFn);

  const deleteFn = createEvent<string>();
  const editFn = createEvent<TodoListTypes.Todo>();
  const statusFn = createEvent<string>();
  const $todos = createStore<TodoListTypes.$Todos>(initial)
    .on(todosFx.doneData, (_, todos) => todos)
    .on(statusFn, (s, id) =>
      s.map((item) =>
        item.id === id ? { ...item, status: item.status === "in-work" ? "completed" : "in-work" } : item
      )
    )
    .on(deleteFn, (s, id) => s.filter((item) => item.id !== id))
    .on(editFn, (s, updatedItem) => s.map((item) => (item.id === updatedItem.id ? updatedItem : item)))
    .on(addFn, (s, text) => {
      if (text) {
        return [...s, { id: String(s.length + 1), status: "in-work", text }];
      }
    })
    .reset(resetFn);

  $todos.watch((state) => {
    console.log("todos", state);
  });

  sample({
    clock: submitFn,
    source: $input,
    target: addFn,
  });

  return {
    addFn,
    deleteFn,
    editFn,
    resetFn,
    statusFn,
    changeFn,
    submitFn,
    todosFx,
    $todos,
    $input,
  };
};

export const todosM = createTodosM([]);
