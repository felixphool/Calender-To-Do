import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import './App.css';
import Time from './Time.js';

function App() {
  const [date, setDate] = useState(new Date());
  const [showTime, setShowTime] = useState(false);
  const [todos, setTodos] = useState({});
  const [currentTodo, setCurrentTodo] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [selectedDateTodos, setSelectedDateTodos] = useState(null);
  const [selectedDateTodosFetched, setSelectedDateTodosFetched] = useState(false);

  const handleTodoChange = (event) => {
    setCurrentTodo(event.target.value);
  };

  const handleTimeChange = (event) => {
    setCurrentTime(event.target.value);
  };

  const handleTodoSubmit = (event) => {
    event.preventDefault();
    const todo = `${currentTodo} (${currentTime})`;
    const formattedDate = date.toDateString();
  
    // Adjust the date by adding one day
    const adjustedDate = new Date(date.getTime() + (24 * 60 * 60 * 1000));
  
    fetch('http://localhost:8000/api/todo/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        task: currentTodo,
        time: currentTime,
        date: adjustedDate.toISOString().split('T')[0],
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const currentTodos = todos[formattedDate] || [];
        setTodos({
          ...todos,
          [formattedDate]: [...currentTodos, todo],
        });
        setCurrentTodo('');
        setCurrentTime('');
        if (selectedDateTodos && selectedDateTodosFetched) {
          setSelectedDateTodos([...selectedDateTodos, todo]);
        }
      })
      .catch((error) => console.error(error));
  };
  
  
  const handleDateClick = (value) => {
    const formattedDate = value.toDateString();
    if (todos[formattedDate]) {
      setSelectedDateTodos(todos[formattedDate]);
    } else {
      setSelectedDateTodos(null);
      setSelectedDateTodosFetched(false); // Reset the fetched flag
    }
    setSelectedDate(formattedDate); // Update the selected date state
  };

  useEffect(() => {
    if (selectedDateTodosFetched) {
      return; // Tasks for selected date have already been fetched
    }
    fetch(`http://localhost:8000/api/todo/?date=${date.toISOString().split('T')[0]}`)
      .then((response) => response.json())
      .then((data) => {
        const todosByDate = {};
        data.forEach((todo) => {
          const formattedDate = new Date(todo.date).toDateString();
          const formattedTodo = `${todo.task} (${todo.time})`;
          if (!todosByDate[formattedDate]) {
            todosByDate[formattedDate] = [formattedTodo];
          } else {
            todosByDate[formattedDate].push(formattedTodo);
          }
        });
        setTodos(todosByDate);
        setSelectedDateTodosFetched(true); // Set the fetched flag
      })
      .catch((error) => console.error(error));
  }, [date, selectedDateTodosFetched]);

  const [selectedDate, setSelectedDate] = useState(null); // Add selectedDate state

  return (
    <div className="app">
      <h1 className="header">React Calendar</h1>
      <div>
        <Calendar onChange={setDate} value={date} onClickDay={handleDateClick} />
      </div>

<Time showTime={showTime} date={date} />

<form onSubmit={handleTodoSubmit}>
  <label>
    Enter your task for {date.toDateString()}:
    <input type="text" value={currentTodo} onChange={handleTodoChange} />
  </label>
  <label>
    Time:
    <input type="time" value={currentTime} onChange={handleTimeChange} />
  </label>
  <button type="submit">Add task</button>
</form>

{/* Check if todos for selected date have been fetched */}
{selectedDateTodos || todos[date.toDateString()] ? (
  <div>
    <h2>Tasks for {selectedDate || date.toDateString()}</h2> {/* Use selectedDate or default to current date */}
    <ul>
      {(selectedDateTodos || todos[date.toDateString()]).map((todo, index) => (
        <li key={index}>{todo}</li>
      ))}
    </ul>
  </div>
) : null}
</div>
);
}

export default App;




