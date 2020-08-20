import React, { useState, useEffect, useRef } from 'react';
import TodoList from './TodoList';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';

const TodoApp = () => {
  const { transcript, resetTranscript } = useSpeechRecognition('');
  const [todos, setTodos] = useState([]);
  const [prevTodos, setprevTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [item, setItem] = useState('');
  const API_URL = 'https://abhility-fakedb.glitch.me/todos';
  const filterRef = useRef(null);
  const sortRef = useRef(null);

  const fetchData = (showLoader) => {
    setLoading(showLoader);
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        data = data.map((item) => {
          return {
            ...item,
            loading: false,
            name: item.name.toLowerCase(),
            date: new Date(item.date),
          };
        });
        data = data.reverse();
        Array.isArray(data)
          ? setTodos((prev) => {
              setprevTodos(data);
              return data;
            })
          : setTodos([]);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

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
        fetchData(true);
        addedDateSort();
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const deleteItem = (id) => {
    let newTodos = todos.map((todo) => {
      if (todo.id === id) {
        todo.loading = true;
      }
      return todo;
    });
    setTodos(newTodos);
    fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((data) => {
        fetchData(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const alterItem = (id) => {
    let newTodos = todos.map((todo) => {
      if (todo.id === id) {
        todo.loading = true;
      }
      return todo;
    });
    setTodos(newTodos);
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
        fetchData(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchData(true);
  }, []);

  const changeStyles = (targetRef, targetEvent) => {
    const { target: currentElement } = targetEvent;
    targetRef.current.childNodes.forEach((child, index) => {
      if (index > 0) {
        child.classList.remove('teal');
        child.classList.remove('white-text');
        child.classList.remove('z-depth-3');
      }
    });

    currentElement.classList.add('teal');
    currentElement.classList.add('white-text');
    currentElement.classList.add('z-depth-3');
  };

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

  const listen = (event) => {
    resetTranscript('');
    setListening((prevListening) => {
      !prevListening
        ? SpeechRecognition.startListening()
        : SpeechRecognition.stopListening();
      return !prevListening;
    });

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
          {/* <label htmlFor="input">Type here</label> */}
        </div>
        <div className="input-field col s6 l2 m2">
          <button
            type="submit"
            className="btn-floating btn-large waves-effect waves-light hoverable"
          >
            <i className="material-icons">edit</i>
          </button>
        </div>
        <div className="input-field col s6 l2 m2">
          <button
            type="button"
            className={
              listening
                ? 'btn-floating btn-large waves-effect waves-light hoverable red pulse'
                : 'btn-floating btn-large waves-effect waves-light hoverable teal'
            }
            onClick={listen}
          >
            <i className="material-icons">{listening ? 'stop' : 'mic'}</i>
          </button>
        </div>
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
