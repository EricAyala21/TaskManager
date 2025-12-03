import './Login.css';

function App() {
  return (
    <div className="background">
      <div className="foreground">
        <h1>Login</h1>
        <label>
          Username: <input name="user"/><br></br>
          Password: <input name="pass"/>
        </label>
        <button className = "Submit">Login</button>
      </div>
    </div>
  );
}

export default App;
