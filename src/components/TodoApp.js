import React, { useState, useEffect, useRef } from 'react';
import TodoList from './TodoList';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';

import httpRequest from '../helpers/httpClient';
import changeStyles from '../helpers/utils';

const TodoApp = () => {
  const { transcript, resetTranscript, listening } = useSpeechRecognition('');
  const [todos, setTodos] = useState([]);
  const [prevTodos, setprevTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState('');
  const API_URL = 'https://abhility-fakedb.glitch.me/todos';
  const filterRef = useRef(null);
  const sortRef = useRef(null);

  const supportsSpeechRecognition = SpeechRecognition.browserSupportsSpeechRecognition();

  const fetchData = async (showLoader) => {
    setLoading(showLoader);
    try {
      let data = await httpRequest(API_URL, 'GET', null);
      data = data.reverse().map((item) => {
        return {
          ...item,
          loading: false,
          name: item.name.toLowerCase(),
          date: new Date(item.date).toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          }),
        };
      });
      if (Array.isArray(data)) {
        setTodos(data);
        setprevTodos(data);
        changeStyles(filterRef, null);
        changeStyles(sortRef, null);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const handleChange = (event) => {
    const { value } = event.target;
    setItem(value);
  };

  const addTodo = async (event) => {
    event.preventDefault();
    setLoading(true);
    const todo = {
      name: item,
      date: Date.now(),
      done: false,
    };
    setItem('');
    try {
      await httpRequest(API_URL, 'POST', todo);
      await fetchData(false);
      window.M.toast({
        html: '<h6>Todo item added!</h6>',
        classes: 'green accent-4 white-text',
        displayLength: 1500,
      });
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const deleteItem = async (id) => {
    let newTodos = todos.map((todo) => {
      if (todo.id === id) {
        todo.loading = true;
      }
      return todo;
    });
    setTodos(newTodos);
    try {
      await httpRequest(`${API_URL}/${id}`, 'DELETE', null);
      await fetchData(false);
      window.M.toast({
        html: '<h6>Todo item deleted!</h6>',
        classes: 'red accent-4 white-text',
        displayLength: 1500,
      });
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const alterItem = async (id) => {
    let newTodos = todos.map((todo) => {
      if (todo.id === id) {
        todo.loading = true;
      }
      return todo;
    });

    let todo = todos.find((todo) => todo.id === id);
    todo = { ...todo, done: !todo.done };
    setTodos(newTodos);
    try {
      await httpRequest(`${API_URL}/${id}`, 'PUT', todo);
      await fetchData(false);
      todo.done
        ? window.M.toast({
            html: '<h6>Marked as completed!</h6>',
            classes: 'teal accent-4 white-text',
            displayLength: 1500,
          })
        : window.M.toast({
            html: '<h6>Marked as Inprogress!</h6>',
            classes: 'teal accent-4 white-text',
            displayLength: 1500,
          });
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData(true);
  }, []);

  const alphabeticSort = (event) => {
    changeStyles(sortRef, event);
    const sortedTodos = todos.sort((first, second) =>
      first.name < second.name ? -1 : first.name > second.name ? 1 : 0
    );
    setTodos((prevTodos) => [...sortedTodos]);
  };

  const addedDateSort = (event) => {
    changeStyles(sortRef, event);
    const sortedTodos = todos.sort((first, second) =>
      first.date > second.date ? -1 : first.date < second.date ? 1 : 0
    );
    setTodos((prevTodos) => [...sortedTodos]);
  };

  const filterByComplete = (event) => {
    changeStyles(filterRef, event);
    const filteredTodos = prevTodos.filter((todo) => todo.done);
    setTodos((prevTodos) => [...filteredTodos]);
  };

  const filterByInprogress = (event) => {
    changeStyles(filterRef, event);
    const filteredTodos = prevTodos.filter((todo) => !todo.done);
    setTodos((prevTodos) => [...filteredTodos]);
  };

  const showAll = (event) => {
    changeStyles(filterRef, event);
    setTodos(prevTodos);
  };

  const listen = (start) => {
    resetTranscript('');
    if (start) {
      window.M.toast({
        html: '<h6>This feature is still in beta testing phase</h6>',
        classes: 'black accent-4 white-text',
        displayLength: 2500,
      });
      SpeechRecognition.startListening();
    } else {
      SpeechRecognition.stopListening();
    }
    setItem(transcript);
  };

  return (
    <div style={{ margin: '25px auto' }}>
      <form className="container row" onSubmit={addTodo}>
        <div className="input-field col s12 l8 m8">
          <input
            id="input"
            type="text"
            name="item"
            value={item}
            placeholder="Type your todo here..."
            onChange={handleChange}
            className="validate"
            required
          />
        </div>
        <div className="input-field col s6 l2 m2">
          <button
            type="submit"
            className="btn-floating btn-large waves-effect waves-light hoverable"
          >
            <i className="material-icons">edit</i>
          </button>
        </div>
        {supportsSpeechRecognition && (
          <div className="input-field col s6 l2 m2">
            {listening ? (
              <button
                type="button"
                className="btn-floating btn-large waves-effect waves-light hoverable red pulse"
                onClick={listen.bind(null, false)}
              >
                <i className="material-icons">stop</i>
              </button>
            ) : (
              <button
                type="button"
                className="btn-floating btn-large waves-effect waves-light hoverable teal"
                onClick={listen.bind(null, true)}
              >
                <i className="material-icons">mic</i>
              </button>
            )}
          </div>
        )}
      </form>
      {listening && (
        <div className="container row">
          <h6 className="col s12 l12 m12 teal-text">Listening...</h6>
        </div>
      )}
      <div className="actions container row" ref={sortRef}>
        <span className="chip col s8 l2 orange white-text action-label z-depth-3">
          <i className="material-icons">sort</i>
          Sort By
        </span>
        <span className="col s0 l4" />
        <span className="chip col s8 l2 action-button" onClick={alphabeticSort}>
          Alphabetically
        </span>
        <span className="col s0 l2" />
        <span className="chip col s8 l2 action-button" onClick={addedDateSort}>
          Added Date
        </span>
      </div>
      <div className="actions container row" ref={filterRef}>
        <span className="chip col s8 l2 green white-text action-label z-depth-3">
          <i className="material-icons">photo_filter</i>
          Filter By
        </span>
        <span className="col s0 l2" />
        <span
          className="chip col s8 l2 action-button"
          onClick={filterByComplete}
        >
          Completed
        </span>
        <span
          className="chip col s8 l2 action-button"
          onClick={filterByInprogress}
        >
          Inprogress
        </span>
        <span className="chip col s8 l2 action-button" onClick={showAll}>
          All
        </span>
      </div>
      <div className="container row">
        <TodoList
          todos={todos}
          deleteItem={deleteItem}
          alterItem={alterItem}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default TodoApp;
