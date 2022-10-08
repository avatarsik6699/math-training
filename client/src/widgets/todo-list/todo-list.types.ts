export namespace TodoListTypes {
  export type $Todos = Array<Todo>;
  export type Todo = { id: string; text: string; status: "completed" | "in-work" };

}
