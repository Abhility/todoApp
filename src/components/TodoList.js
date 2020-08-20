import React from 'react';
import TodoItem from './TodoItem';

const TodoList = (props) => {
  const { todos, deleteItem, alterItem, loading } = props;
  const todoList = todos.map((todo) => (
    <TodoItem
      key={todo.id}
      data={todo}
      deleteItem={deleteItem}
      alterItem={alterItem}
    ></TodoItem>
  ));

  return (
    <ul className="collection">
      {loading && (
        <li className="collection-item loader">
          <img
            src="../spin.gif"
            alt="loading..."
            height="100px"
            width="100px"
          />
        </li>
      )}
      {todoList}
    </ul>
  );
};

export default TodoList;
