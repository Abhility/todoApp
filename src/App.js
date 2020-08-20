import React from 'react';
import TodoApp from './components/TodoApp';

const App = () => {
  return (
    <>
      <nav>
        <div className="nav-wrapper teal">
          <a href="#" className="brand-logo center">
            Notes App
          </a>
        </div>
      </nav>
      <div className=" container header">
        <TodoApp />
      </div>
    </>
  );
};

export default App;
