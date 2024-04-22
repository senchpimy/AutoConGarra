import './App.css';

const sliders = ["Garra", "Muñeca", "Codo", "Hombro", "Rotacion"]

function create_slider(id) {
  return (
    <div>
      <input type="range" min="0" max="180" className="slider" id={id} />
      {id}
    </div>
  );
}

function App() {
  let arr = []
  for (let id of sliders) {
    arr.push(create_slider(id))
  }

  return (
    <div>
      {arr}
      <div id="3d">
      </div>
    </div>
  );
}


export default App;
