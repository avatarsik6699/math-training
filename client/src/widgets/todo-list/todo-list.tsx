import { useStore } from "effector-react";
import React from "react";
import { Form } from "react-router-dom";
import TodoTitle from "../../entities/todo-title/todo-title";
import { todosM } from "./model/todo-model";
import "./todo-list.scss";

const TodoList: React.FC = () => {
  const { addFn, deleteFn, submitFn, resetFn, statusFn, changeFn, todosFx } = todosM;

  const todos = useStore(todosM.$todos);
  const input = useStore(todosM.$input);

  console.log(todosFx.pending);
  return (
    <div className="todo-list">
      <div className="todo-list__header">
        <TodoTitle title="Мой туду лист" />
        <button children="refetch"/>
      </div>
      <Form>
        <input onChange={({ target }) => changeFn(target.value)} value={input} type="text" />
        <button type="submit" onClick={submitFn} children="add" />
      </Form>

      <button onClick={() => resetFn()} children="reset" />
      <ul>
        {todos.map((item) => (
          <li>
            <span>{item.id}</span>
            <span style={{ background: item.status === "completed" ? "green" : "white" }}>{item.text}</span>
            <button onClick={() => statusFn(item.id)}>{item.status === "in-work" ? "✔" : "❌"}</button>
            <button onClick={() => deleteFn(item.id)} children="delete" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
