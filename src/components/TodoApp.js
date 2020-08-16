import React, { useState, useEffect } from 'react';
import TodoItem from './TodoItem';
import TodoList from './TodoList';

export default function Todos() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState('');
  const API_URL = 'https://abhility-fakedb.glitch.me/todos';

  const fetchData = () => {
    setLoading(true);
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        Array.isArray(data) ? setTodos(data) : setTodos([]);
        console.log(todos);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (event) => {
    const { value } = event.target;
    setItem(value);
  };

  const addTodo = (event) => {
    event.preventDefault();
    setLoading(true);
    const todo = {
      name: item,
      date: Date.now(),
      done: false,
    };

    setItem('');

    fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify(todo),
      headers: {
        'content-type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        fetchData();
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const deleteItem = (id) => {
    setLoading(true);
    fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        fetchData();
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const alterItem = (id) => {
    let todo = todos.find((todo) => todo.id === id);
    todo = { ...todo, done: !todo.done };
    fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(todo),
      headers: {
        'content-type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        fetchData();
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  return (
    <div style={{ margin: '25px auto' }}>
      <form className="container row" onSubmit={addTodo}>
        <div className="input-field col s10">
          <input
            id="input"
            type="text"
            name="item"
            value={item}
            onChange={handleChange}
            className="validate"
            required
          />
          <label htmlFor="input">Type here</label>
        </div>
        <div className="input-field col s2">
          <button className="btn-floating btn-large waves-effect waves-light hoverable pulse">
            <i className="material-icons">edit</i>
          </button>
        </div>
      </form>
      <div className="container row">
        {loading ? (
          <div>
            <h5>Loading...</h5>
            <div className="progress col s6">
              <div className="indeterminate"></div>
            </div>
          </div>
        ) : (
          <TodoList
            todos={todos}
            deleteItem={deleteItem}
            alterItem={alterItem}
          />
        )}
      </div>
    </div>
  );
}
