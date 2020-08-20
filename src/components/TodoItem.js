import React from 'react';
import Speech from 'react-speech';

const TodoItem = (props) => {
  const { data, deleteItem, alterItem } = props;
  return (
    <li className="collection-item hoverable todo-item">
      <div className="todo">
        <section>
          <h5 style={{ textDecoration: data.done ? 'line-through' : 'none' }}>
            {data.name}
            <Speech
              textAsButton={true}
              displayText={
                <i className="material-icons teal-text">volume_up</i>
              }
              className="chip"
              style={{ background: 'transparent' }}
              rate="1.3"
              text={data.name}
              lang="EN-US"
            />
          </h5>
          <p className="grey-text chip todo-date">
            <span className="teal-text">Added On : </span>
            {data.date}
          </p>
        </section>
        <section className="todo-actions">
          {data.loading ? (
            <img
              src="../loader.gif"
              alt="loading..."
              height="50px"
              width="50px"
            />
          ) : (
            <>
              {data.done ? (
                <a
                  className="secondary-content waves-effect"
                  style={{ margin: '0px 20px' }}
                  onClick={alterItem.bind(null, data.id)}
                >
                  <i className="material-icons red-text">clear</i>
                </a>
              ) : (
                <a
                  className="secondary-content waves-effect"
                  style={{ margin: '0px 20px' }}
                  onClick={alterItem.bind(null, data.id)}
                >
                  <i className="material-icons teal-text">done</i>
                </a>
              )}
              <a
                className="secondary-content waves-effect"
                onClick={deleteItem.bind(null, data.id)}
              >
                <i className="material-icons red-text">delete</i>
              </a>
            </>
          )}
        </section>
      </div>
    </li>
  );
};

export default TodoItem;
