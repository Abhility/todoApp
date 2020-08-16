import React from 'react';

export default function TodoItem(props) {
  const { data, deleteItem, alterItem } = props;

  return (
    <li className="collection-item hoverable todo-item">
      <div className="todo">
        <section>
          <h4 style={{ textDecoration: data.done ? 'line-through' : 'none' }}>
            {data.name}
          </h4>
          <p className="grey-text chip todo-date">
            <span className="teal-text">Added On : </span>
            {new Date(data.date).toLocaleString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
            })}
          </p>
        </section>
        <section className="todo-actions">
          <a
            className="secondary-content waves-effect"
            onClick={deleteItem.bind(null, data.id)}
          >
            <i className="material-icons red-text">delete</i>
          </a>
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
              <i className="material-icons green-text">done</i>
            </a>
          )}
        </section>
      </div>
    </li>
  );
}
