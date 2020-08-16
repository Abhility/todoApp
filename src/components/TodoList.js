import React from 'react';
import TodoItem from './TodoItem';

export default function TodoList({ todos, deleteItem, alterItem }) {
  const todoList = todos.map((todo) => (
    <TodoItem
      key={todo.id}
      data={todo}
      deleteItem={deleteItem}
      alterItem={alterItem}
    ></TodoItem>
  ));

  const content = 'No Todos in your list';

  return <ul className="collection">{todoList}</ul>;
}
