import React from 'react';
import TodoApp from './components/TodoApp';

const App = () => {
  return (
    <div className=" container header">
      <h2 className="container teal-text">TodoList App</h2>
      <TodoApp />
    </div>
  );
};

export default App;
