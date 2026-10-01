import { useState } from "react";
import "./App.css";

// ---------- Дочерний компонент: форма добавления ----------
function AddForm(props) {
  const [name, setName] = useState("");
  const [heroClass, setHeroClass] = useState("Warrior");

  function handleSubmit(e) {
    e.preventDefault();
    if (name === "") return;
    props.onAdd(name, heroClass);
    setName("");
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Имя героя"
      />
      <select value={heroClass} onChange={(e) => setHeroClass(e.target.value)}>
        <option>Warrior</option>
        <option>Mage</option>
        <option>Rogue</option>
        <option>Healer</option>
      </select>
      <button type="submit">Добавить</button>
    </form>
  );
}

// ---------- Дочерний компонент: карточка героя ----------
function HeroCard(props) {
  const hero = props.hero;

  // ЛОКАЛЬНОЕ состояние карточки (у каждой карточки своё)
  const [energy, setEnergy] = useState(50);
  const [showDetails, setShowDetails] = useState(false);

  console.log("Рендер карточки:", hero.name);

  return (
    <div className="card">
      <h3>{hero.name}</h3>
      <p className="class">{hero.heroClass}</p>

      <label>
        Статус:{" "}
        <select
          value={hero.status}
          onChange={(e) => props.onChangeStatus(hero.id, e.target.value)}
        >
          <option>Ready</option>
          <option>On Quest</option>
          <option>Resting</option>
        </select>
      </label>

      <div className="energy">
        <button onClick={() => setEnergy(energy - 10)} disabled={energy <= 0}>-</button>
        <span>Energy: {energy}</span>
        <button onClick={() => setEnergy(energy + 10)} disabled={energy >= 100}>+</button>
      </div>

      <button onClick={() => setShowDetails(!showDetails)}>
        {showDetails ? "Скрыть" : "Подробнее"}
      </button>

      {showDetails && (
        <p className="details">ID: {hero.id}, сбросов: {hero.resetCount}</p>
      )}

      <div className="buttons">
        <button onClick={() => props.onReset(hero.id)}>Сбросить state</button>
        <button className="delete" onClick={() => props.onRemove(hero.id)}>Удалить</button>
      </div>
    </div>
  );
}

// ---------- Родительский компонент ----------
export default function App() {
  const [heroes, setHeroes] = useState([
    { id: 1, name: "Arthas", heroClass: "Warrior", status: "Ready", resetCount: 0 },
    { id: 2, name: "Lyra", heroClass: "Mage", status: "On Quest", resetCount: 0 },
    { id: 3, name: "Shade", heroClass: "Rogue", status: "Resting", resetCount: 0 },
  ]);
  const [filter, setFilter] = useState("All");
  const [reversed, setReversed] = useState(false);

  console.log("Рендер App");

  function addHero(name, heroClass) {
    const newHero = {
      id: Date.now(),
      name: name,
      heroClass: heroClass,
      status: "Ready",
      resetCount: 0,
    };
    setHeroes([...heroes, newHero]);
  }

  function removeHero(id) {
    setHeroes(heroes.filter((h) => h.id !== id));
  }

  function changeStatus(id, newStatus) {
    setHeroes(
      heroes.map((h) => (h.id === id ? { ...h, status: newStatus } : h))
    );
  }

  // Меняем resetCount -> меняется key -> React создаёт карточку заново
  function resetHero(id) {
    setHeroes(
      heroes.map((h) =>
        h.id === id ? { ...h, resetCount: h.resetCount + 1 } : h
      )
    );
  }

  // Фильтр и разворот списка
  let shownHeroes = heroes;
  if (filter !== "All") {
    shownHeroes = heroes.filter((h) => h.status === filter);
  }
  if (reversed) {
    shownHeroes = [...shownHeroes].reverse();
  }

  return (
    <div className="app">
      <h1>Guild Dashboard</h1>
      <p>Героев в гильдии: {heroes.length}</p>

      <AddForm onAdd={addHero} />

      <div className="toolbar">
        <button onClick={() => setFilter("All")}>All</button>
        <button onClick={() => setFilter("Ready")}>Ready</button>
        <button onClick={() => setFilter("On Quest")}>On Quest</button>
        <button onClick={() => setFilter("Resting")}>Resting</button>
        <button onClick={() => setReversed(!reversed)}>Reverse</button>
      </div>

      <p>Фильтр: {filter}</p>

      {shownHeroes.length === 0 ? (
        <p>Нет героев с таким статусом</p>
      ) : (
        <div className="grid">
          {shownHeroes.map((h) => (
            <HeroCard
              key={h.id + "-" + h.resetCount}
              hero={h}
              onRemove={removeHero}
              onChangeStatus={changeStatus}
              onReset={resetHero}
            />
          ))}
        </div>
      )}
    </div>
  );
}