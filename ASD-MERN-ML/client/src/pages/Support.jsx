// client/src/pages/Support.jsx
import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

// --- Small Snake Game component (default game) ---
const GRID_SIZE = 15;

function SnakeGame({ onClose }) {
  const [snake, setSnake] = useState([
    { x: 7, y: 7 },
    { x: 6, y: 7 },
  ]);
  const [food, setFood] = useState({ x: 3, y: 3 });
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const randomFood = useCallback(() => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      // Prevent page scroll while playing with arrow keys
      if (
        running &&
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)
      ) {
        e.preventDefault();
      }

      if (!running) return;
      if (e.key === "ArrowUp" && direction.y !== 1) {
        setDirection({ x: 0, y: -1 });
      } else if (e.key === "ArrowDown" && direction.y !== -1) {
        setDirection({ x: 0, y: 1 });
      } else if (e.key === "ArrowLeft" && direction.x !== 1) {
        setDirection({ x: -1, y: 0 });
      } else if (e.key === "ArrowRight" && direction.x !== -1) {
        setDirection({ x: 1, y: 0 });
      }
    },
    [direction, running]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown, { passive: false });
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (!running || gameOver) return;

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + direction.x,
          y: head.y + direction.y,
        };

        // wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          setRunning(false);
          return prevSnake;
        }

        // self collision
        if (prevSnake.some((seg) => seg.x === newHead.x && seg.y === newHead.y)) {
          setGameOver(true);
          setRunning(false);
          return prevSnake;
        }

        let newSnake = [newHead, ...prevSnake];

        // food
        if (newHead.x === food.x && newHead.y === food.y) {
          setFood(randomFood());
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 220); // slightly slow movement

    return () => clearInterval(interval);
  }, [direction, running, gameOver, food, randomFood]);

  const startGame = () => {
    setSnake([
      { x: 7, y: 7 },
      { x: 6, y: 7 },
    ]);
    setDirection({ x: 1, y: 0 });
    setFood(randomFood());
    setGameOver(false);
    setRunning(true);
  };

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-blue-700 text-sm">
          Snake Game (use arrow keys)
        </h3>
        <div className="flex gap-2">
          <button
            onClick={startGame}
            className="px-3 py-1 text-xs rounded bg-green-500 text-white hover:bg-green-600"
          >
            {gameOver ? "Restart" : running ? "Restart" : "Start"}
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1 text-xs rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>

      <div
        className="border rounded-lg bg-slate-900 mx-auto"
        style={{
          width: 300,
          height: 300,
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, idx) => {
          const x = idx % GRID_SIZE;
          const y = Math.floor(idx / GRID_SIZE);
          const isSnake = snake.some((s) => s.x === x && s.y === y);
          const isHead = snake[0].x === x && snake[0].y === y;
          const isFood = food.x === x && food.y === y;
          return (
            <div
              key={idx}
              className="border border-slate-800"
              style={{
                backgroundColor: isHead
                  ? "#22c55e"
                  : isSnake
                  ? "#16a34a"
                  : isFood
                  ? "#f97316"
                  : "transparent",
              }}
            />
          );
        })}
      </div>
      {gameOver && (
        <div className="mt-2 text-center text-red-500 text-sm font-semibold">
          Game Over!
        </div>
      )}
    </div>
  );
}

// --- Pattern Match Game (default game) ---
function createPattern() {
  const colors = ["blue", "yellow"];
  return Array.from({ length: 4 }, () => colors[Math.floor(Math.random() * 2)]);
}

function PatternMatchGame({ onClose }) {
  const [target, setTarget] = useState(createPattern);
  const [options, setOptions] = useState([]);
  const [message, setMessage] = useState("");

  const generateRound = () => {
    const base = createPattern();
    // create a slightly different pattern
    const diff = [...base];
    const idx = Math.floor(Math.random() * diff.length);
    diff[idx] = diff[idx] === "blue" ? "yellow" : "blue";

    let opts = [
      { pattern: base, correct: true },
      { pattern: diff, correct: false },
    ];
    // shuffle options
    opts = opts.sort(() => Math.random() - 0.5);

    setTarget(base);
    setOptions(opts);
    setMessage("");
  };

  useEffect(() => {
    generateRound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = (opt) => {
    if (opt.correct) {
      setMessage("Great job! You matched the pattern correctly.");
      setTimeout(() => {
        generateRound();
      }, 800);
    } else {
      setMessage("Not quite, try again.");
    }
  };

  const renderPattern = (pattern) => (
    <div className="flex gap-1 justify-center">
      {pattern.map((c, i) => (
        <div
          key={i}
          className={`w-5 h-5 rounded-full ${
            c === "blue" ? "bg-sky-500" : "bg-amber-400"
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="mt-4 border-t border-slate-100 pt-3">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-indigo-700 text-sm">
          Pattern Match Game
        </h3>
        <button
          onClick={onClose}
          className="px-3 py-1 text-xs rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          Close
        </button>
      </div>

      <p className="text-xs text-slate-600 mb-2">
        Look at the colour pattern and pick the row that matches it. This helps
        with visual attention and pattern recognition.
      </p>

      <div className="mb-3">
        <p className="text-xs font-medium text-slate-700 mb-1">
          Target pattern:
        </p>
        {renderPattern(target)}
      </div>

      <div className="flex flex-col gap-2">
        {options.map((opt, idx) => {
          const optionLabel = String.fromCharCode(65 + idx); // A, B, ...
          return (
            <button
              key={idx}
              onClick={() => handleSelect(opt)}
              className="w-full border border-slate-200 rounded-lg py-1 hover:bg-slate-50"
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-[11px] font-semibold text-slate-700">
                  Option {optionLabel}
                </span>
                {renderPattern(opt.pattern)}
              </div>
            </button>
          );
        })}
      </div>

      {message && (
        <div className="mt-2 text-xs text-center text-slate-700">{message}</div>
      )}
    </div>
  );
}

// --- Memory Cards Game (default game) ---
const MEMORY_SYMBOLS = ["★", "●", "▲", "◆"];

function createMemoryDeck() {
  const base = [...MEMORY_SYMBOLS, ...MEMORY_SYMBOLS]; // 4 pairs => 8 cards
  const deck = base
    .map((val, idx) => ({
      id: idx,
      value: val,
    }))
    .sort(() => Math.random() - 0.5);
  return deck;
}

function MemoryCardGame({ onClose }) {
  const [cards, setCards] = useState(() =>
    createMemoryDeck().map((c) => ({ ...c, matched: false }))
  );
  const [flipped, setFlipped] = useState([]); // indices
  const [message, setMessage] = useState("");
  const [matches, setMatches] = useState(0);

  const restart = () => {
    setCards(createMemoryDeck().map((c) => ({ ...c, matched: false })));
    setFlipped([]);
    setMessage("");
    setMatches(0);
  };

  const handleFlip = (index) => {
    if (flipped.includes(index)) return;
    if (cards[index].matched) return;
    if (flipped.length === 2) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [i, j] = newFlipped;
      if (cards[i].value === cards[j].value) {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, idx) =>
              idx === i || idx === j ? { ...c, matched: true } : c
            )
          );
          setFlipped([]);
          setMatches((m) => m + 1);
          setMessage("Nice! You found a matching pair.");
        }, 600);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setMessage("Try again and remember the symbols.");
        }, 700);
      }
    }
  };

  const allMatched = matches === MEMORY_SYMBOLS.length;

  return (
    <div className="mt-4 border-t border-slate-100 pt-3">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-indigo-700 text-sm">
          Memory Cards Game
        </h3>
        <div className="flex gap-2">
          <button
            onClick={restart}
            className="px-3 py-1 text-xs rounded bg-sky-500 text-white hover:bg-sky-600"
          >
            Restart
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1 text-xs rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>

      <p className="text-xs text-slate-600 mb-2">
        Flip two cards at a time and try to find matching pairs. This supports
        working memory and focus.
      </p>

      <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto mt-2">
        {cards.map((c, index) => {
          const isFlipped = flipped.includes(index) || c.matched;
          return (
            <button
              key={c.id}
              onClick={() => handleFlip(index)}
              className={`h-14 rounded-lg flex items-center justify-center text-xl font-bold border transition
                ${
                  isFlipped
                    ? "bg-indigo-100 border-indigo-400 text-indigo-700"
                    : "bg-slate-200 border-slate-300 text-slate-400"
                }`}
            >
              {isFlipped ? c.value : "?"}
            </button>
          );
        })}
      </div>

      <div className="mt-2 text-xs text-center text-slate-700">
        {allMatched
          ? "Excellent! You matched all pairs. You can restart to play again."
          : message || "Tap a card to flip it and find pairs."}
      </div>
    </div>
  );
}

// Helper: derive a YouTube thumbnail from URL
function getYoutubeThumbnail(url) {
  if (!url) return null;
  try {
    let videoId = null;
    if (url.includes("youtube.com/watch")) {
      const params = new URL(url).searchParams;
      videoId = params.get("v");
    } else if (url.includes("youtu.be/")) {
      const parts = url.split("youtu.be/");
      videoId = parts[1].split(/[?&]/)[0];
    }
    if (!videoId) return null;
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  } catch (e) {
    return null;
  }
}

export default function Support() {
  const [tab, setTab] = useState("doctors");
  const [doctors, setDoctors] = useState([]);
  const [schools, setSchools] = useState([]);
  const [videos, setVideos] = useState([]);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // which default game is currently opened as a "new page"
  const [activeGame, setActiveGame] = useState(null); // 'snake' | 'pattern' | 'memory' | null

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setErr("");
      try {
        const [docRes, schRes, vidRes, gameRes] = await Promise.all([
          axios.get(`${API_BASE}/api/support/doctors`),
          axios.get(`${API_BASE}/api/support/schools`),
          axios.get(`${API_BASE}/api/support/videos`),
          axios.get(`${API_BASE}/api/support/games`), // games posted by admin
        ]);

        setDoctors(docRes.data || []);
        setSchools(schRes.data || []);
        setVideos(vidRes.data || []);
        setGames(gameRes.data || []);
      } catch (e) {
        console.error("Support fetch error:", e);
        setErr("Unable to load support data right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 py-12 px-4 sm:px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-800 mb-2 text-center">
          Support & Resources
        </h2>
        <p className="text-center text-slate-600 mb-8 max-w-2xl mx-auto text-sm sm:text-base">
          Find trusted doctors, specialized schools, helpful videos, and games
          designed to support focus, attention, memory, and social skills for
          children.
        </p>

        {/* TABS */}
        <div className="bg-white/90 backdrop-blur p-4 rounded-2xl shadow-md mb-8 flex justify-center gap-3 flex-wrap">
          <button
            onClick={() => {
              setTab("doctors");
              setActiveGame(null);
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              tab === "doctors"
                ? "bg-blue-600 text-white shadow"
                : "bg-blue-50 text-blue-700 hover:bg-blue-100"
            }`}
          >
            Doctors
          </button>
          <button
            onClick={() => {
              setTab("schools");
              setActiveGame(null);
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              tab === "schools"
                ? "bg-blue-600 text-white shadow"
                : "bg-blue-50 text-blue-700 hover:bg-blue-100"
            }`}
          >
            Schools
          </button>
          <button
            onClick={() => {
              setTab("videos");
              setActiveGame(null);
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              tab === "videos"
                ? "bg-blue-600 text-white shadow"
                : "bg-blue-50 text-blue-700 hover:bg-blue-100"
            }`}
          >
            ASD Videos
          </button>
          <button
            onClick={() => setTab("games")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              tab === "games"
                ? "bg-blue-600 text-white shadow"
                : "bg-blue-50 text-blue-700 hover:bg-blue-100"
            }`}
          >
            Games
          </button>
        </div>

        {loading && (
          <div className="text-center text-gray-600 mt-4">
            Loading support resources...
          </div>
        )}

        {err && !loading && (
          <div className="text-center text-red-600 mb-4">{err}</div>
        )}

        {/* DOCTORS */}
        {!loading && !err && tab === "doctors" && (
          <motion.div
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {doctors.length === 0 && (
              <div className="col-span-full text-center text-gray-600">
                No doctors added yet. Please ask the admin to add some.
              </div>
            )}
            {doctors.map((d) => (
              <motion.div
                key={d._id || d.id}
                className="bg-white rounded-2xl shadow-md p-4 border border-slate-100 flex flex-col justify-between"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-lg font-semibold text-blue-800">
                      {d.name}
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                      Doctor
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">
                    {d.specialty} • {d.clinic}
                  </p>
                  <p className="mt-2 text-sm text-slate-700">
                    Phone:{" "}
                    <span className="font-medium text-slate-800">
                      {d.phone || "N/A"}
                    </span>
                    <br />
                    Email:{" "}
                    <span className="font-medium text-slate-800">
                      {d.email || "N/A"}
                    </span>
                  </p>
                </div>
                <div className="mt-3 flex gap-2">
                  {d.email && (
                    <a
                      href={`mailto:${d.email}`}
                      className="flex-1 text-center text-xs sm:text-sm bg-blue-600 text-white py-1.5 rounded-full hover:bg-blue-700 transition"
                    >
                      Email
                    </a>
                  )}
                  {d.phone && (
                    <a
                      href={`tel:${d.phone}`}
                      className="flex-1 text-center text-xs sm:text-sm bg-emerald-500 text-white py-1.5 rounded-full hover:bg-emerald-600 transition"
                    >
                      Call
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* SCHOOLS */}
        {!loading && !err && tab === "schools" && (
          <motion.div
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {schools.length === 0 && (
              <div className="col-span-full text-center text-gray-600">
                No schools added yet. Please ask the admin to add some.
              </div>
            )}
            {schools.map((s) => (
              <motion.div
                key={s._id || s.id}
                className="bg-white rounded-2xl shadow-md p-4 border border-slate-100 flex flex-col justify-between"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-lg font-semibold text-blue-800">
                      {s.name}
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">
                      School
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">
                    Location:{" "}
                    <span className="font-medium text-slate-800">
                      {s.location || "N/A"}
                    </span>
                  </p>
                  <p className="mt-2 text-sm text-slate-700">
                    Contact:{" "}
                    <span className="font-medium text-slate-800">
                      {s.contact || "N/A"}
                    </span>
                    <br />
                    Phone:{" "}
                    <span className="font-medium text-slate-800">
                      {s.phone || "N/A"}
                    </span>
                  </p>
                </div>
                <div className="mt-3 flex gap-2">
                  {s.contact && (
                    <a
                      href={
                        s.contact.includes("@")
                          ? `mailto:${s.contact}`
                          : `tel:${s.contact}`
                      }
                      className="flex-1 text-center text-xs sm:text-sm bg-indigo-500 text-white py-1.5 rounded-full hover:bg-indigo-600 transition"
                    >
                      Email
                    </a>
                  )}
                  {s.phone && (
                    <a
                      href={`tel:${s.phone}`}
                      className="flex-1 text-center text-xs sm:text-sm bg-emerald-500 text-white py-1.5 rounded-full hover:bg-emerald-600 transition"
                    >
                      Call
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* VIDEOS (with thumbnails) */}
        {!loading && !err && tab === "videos" && (
          <motion.div
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {videos.length === 0 && (
              <div className="col-span-full text-center text-gray-600">
                No videos added yet. Please ask the admin to add some.
              </div>
            )}
            {videos.map((v) => {
              const thumb =
                v.thumbnailUrl || getYoutubeThumbnail(v.url) || null;
              return (
                <motion.div
                  key={v._id || v.id}
                  className="bg-white rounded-2xl shadow-md overflow-hidden border border-slate-100 flex flex-col"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {thumb && (
                    <div className="h-40 w-full overflow-hidden bg-slate-200">
                      <img
                        src={thumb}
                        alt={v.title || "ASD video"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-lg font-semibold text-blue-800 mb-1">
                      {v.title}
                    </h3>
                    <p className="text-sm text-slate-600 flex-1">
                      {v.notes || "ASD related resource video."}
                    </p>
                    {v.url && (
                      <div className="mt-3">
                        <a
                          href={v.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center text-xs sm:text-sm bg-blue-600 text-white px-4 py-1.5 rounded-full hover:bg-blue-700 transition"
                        >
                          Watch Video
                        </a>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* GAMES (default + admin) */}
        {!loading && !err && tab === "games" && (
          <>
            {activeGame ? (
              // "New page / space" for the selected default game
              <motion.div
                className="bg-white/95 backdrop-blur p-4 sm:p-6 rounded-2xl shadow-xl border border-slate-100"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <button
                    onClick={() => setActiveGame(null)}
                    className="inline-flex items-center text-xs sm:text-sm px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200"
                  >
                    ← Back to Games
                  </button>
                  <span className="text-[11px] sm:text-xs text-slate-500">
                    Default game space
                  </span>
                </div>

                {activeGame === "snake" && (
                  <SnakeGame onClose={() => setActiveGame(null)} />
                )}
                {activeGame === "pattern" && (
                  <PatternMatchGame onClose={() => setActiveGame(null)} />
                )}
                {activeGame === "memory" && (
                  <MemoryCardGame onClose={() => setActiveGame(null)} />
                )}
              </motion.div>
            ) : (
              // Main games page with default games list + admin games
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Info about how games help */}
                <p className="text-sm text-slate-700 mb-2">
                  These simple games are designed to gently support{" "}
                  <span className="font-semibold">
                    attention, visual tracking, pattern recognition and memory
                  </span>{" "}
                  – skills that can be helpful for many children, including
                  those on the autism spectrum.
                </p>

                {/* Default games section (Snake + new games) */}
                <div>
                  <h3 className="text-lg font-semibold text-blue-800 mb-3">
                    Default Games
                  </h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {/* Snake Game Card */}
                    <div className="bg-white rounded-2xl shadow-md p-4 border border-slate-100 flex flex-col justify-between">
                      <div>
                        <h4 className="text-md font-semibold text-emerald-700 mb-1">
                          Snake Focus Game
                        </h4>
                        <p className="text-sm text-slate-600">
                          A simple snake game to improve focus, attention and
                          visual tracking. Use arrow keys to control the snake
                          and avoid walls and your tail.
                        </p>
                      </div>
                      <div className="mt-3">
                        <button
                          onClick={() => setActiveGame("snake")}
                          className="w-full text-xs sm:text-sm bg-emerald-500 text-white py-1.5 rounded-full hover:bg-emerald-600 transition"
                        >
                          Start Game
                        </button>
                      </div>
                    </div>

                    {/* Pattern Match Game Card */}
                    <div className="bg-white rounded-2xl shadow-md p-4 border border-slate-100 flex flex-col justify-between">
                      <div>
                        <h4 className="text-md font-semibold text-indigo-700 mb-1">
                          Pattern Match Game
                        </h4>
                        <p className="text-sm text-slate-600">
                          Children look at a colour pattern and choose the
                          matching row. This helps practise{" "}
                          <span className="font-medium">
                            visual attention and pattern recognition
                          </span>
                          , which are useful for early math and reading skills.
                        </p>
                      </div>
                      <div className="mt-3">
                        <button
                          onClick={() => setActiveGame("pattern")}
                          className="w-full text-xs sm:text-sm bg-indigo-500 text-white py-1.5 rounded-full hover:bg-indigo-600 transition"
                        >
                          Start Pattern Game
                        </button>
                      </div>
                    </div>

                    {/* Memory Cards Game Card */}
                    <div className="bg-white rounded-2xl shadow-md p-4 border border-slate-100 flex flex-col justify-between">
                      <div>
                        <h4 className="text-md font-semibold text-sky-700 mb-1">
                          Memory Cards Game
                        </h4>
                        <p className="text-sm text-slate-600">
                          Flip two cards at a time to find matching pairs. This
                          supports{" "}
                          <span className="font-medium">
                            working memory, focus
                          </span>{" "}
                          and flexible thinking in a gentle, playful way.
                        </p>
                      </div>
                      <div className="mt-3">
                        <button
                          onClick={() => setActiveGame("memory")}
                          className="w-full text-xs sm:text-sm bg-sky-500 text-white py-1.5 rounded-full hover:bg-sky-600 transition"
                        >
                          Start Memory Game
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Admin posted games */}
                <div>
                  <h3 className="text-lg font-semibold text-blue-800 mb-3">
                    Games Added by Admin
                  </h3>
                  {games.length === 0 ? (
                    <div className="text-sm text-gray-600">
                      No games added by admin yet.
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {games.map((g) => (
                        <motion.div
                          key={g._id || g.id}
                          className="bg-white rounded-2xl shadow-md p-4 border border-slate-100 flex flex-col justify-between"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <div>
                            <h4 className="text-md font-semibold text-indigo-700 mb-1">
                              {g.title || "Game"}
                            </h4>
                            <p className="text-sm text-slate-600">
                              {g.description ||
                                "Interactive game shared by admin to support learning and attention."}
                            </p>
                          </div>
                          <div className="mt-3">
                            {g.url && (
                              <a
                                href={g.url}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full inline-flex justify-center text-xs sm:text-sm bg-blue-600 text-white py-1.5 rounded-full hover:bg-blue-700 transition"
                              >
                                Open Game
                              </a>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
