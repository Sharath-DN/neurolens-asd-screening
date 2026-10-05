// client/src/pages/AdminPanel.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function AdminPanel() {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [schools, setSchools] = useState([]);
  const [videos, setVideos] = useState([]);
  const [games, setGames] = useState([]);
  const [tab, setTab] = useState("doctors");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // form states
  const [docForm, setDocForm] = useState({
    name: "",
    specialty: "",
    phone: "",
    email: "",
    clinic: "",
  });
  const [schoolForm, setSchoolForm] = useState({
    name: "",
    location: "",
    contact: "",
    phone: "",
  });
  const [videoForm, setVideoForm] = useState({
    title: "",
    url: "",
    notes: "",
    thumbnail: "",
  });
  const [gameForm, setGameForm] = useState({
    title: "",
    url: "",
    description: "",
    thumbnail: "",
  });

  // edit state
  const [editingDoctorId, setEditingDoctorId] = useState(null);
  const [editingSchoolId, setEditingSchoolId] = useState(null);
  const [editingVideoId, setEditingVideoId] = useState(null);
  const [editingGameId, setEditingGameId] = useState(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("adminToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // initial load
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin-login");
      return;
    }

    const fetchAll = async () => {
      try {
        setLoading(true);
        setError("");

        const [docRes, schRes, vidRes, gameRes] = await Promise.all([
          axios.get(`${API_BASE}/api/admin/doctors`, {
            headers: getAuthHeaders(),
          }),
          axios.get(`${API_BASE}/api/admin/schools`, {
            headers: getAuthHeaders(),
          }),
          axios.get(`${API_BASE}/api/admin/videos`, {
            headers: getAuthHeaders(),
          }),
          axios.get(`${API_BASE}/api/admin/games`, {
            headers: getAuthHeaders(),
          }),
        ]);

        setDoctors(docRes.data || []);
        setSchools(schRes.data || []);
        setVideos(vidRes.data || []);
        setGames(gameRes.data || []);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message ||
            "Failed to load admin data. Please log in again."
        );
        if (err.response?.status === 401) {
          localStorage.removeItem("adminToken");
          navigate("/admin-login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [navigate]);

  // ---- DOCTORS ----
  const submitDoctor = async (e) => {
    e.preventDefault();
    try {
      if (editingDoctorId) {
        const res = await axios.put(
          `${API_BASE}/api/admin/doctors/${editingDoctorId}`,
          docForm,
          { headers: getAuthHeaders() }
        );
        setDoctors((prev) =>
          prev.map((d) =>
            (d._id || d.id) === editingDoctorId ? res.data : d
          )
        );
        setEditingDoctorId(null);
      } else {
        const res = await axios.post(
          `${API_BASE}/api/admin/doctors`,
          docForm,
          { headers: getAuthHeaders() }
        );
        setDoctors((prev) => [res.data, ...prev]);
      }
      setDocForm({
        name: "",
        specialty: "",
        phone: "",
        email: "",
        clinic: "",
      });
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message || "Failed to save doctor. Check the data."
      );
    }
  };

  const removeDoctor = async (id) => {
    if (!window.confirm("Remove this doctor?")) return;
    try {
      await axios.delete(`${API_BASE}/api/admin/doctors/${id}`, {
        headers: getAuthHeaders(),
      });
      setDoctors((prev) => prev.filter((d) => d._id !== id && d.id !== id));
      if (editingDoctorId === id) {
        setEditingDoctorId(null);
        setDocForm({
          name: "",
          specialty: "",
          phone: "",
          email: "",
          clinic: "",
        });
      }
    } catch (err) {
      console.error(err);
      alert("Failed to remove doctor.");
    }
  };

  const startEditDoctor = (doc) => {
    setEditingDoctorId(doc._id || doc.id);
    setDocForm({
      name: doc.name || "",
      specialty: doc.specialty || "",
      phone: doc.phone || "",
      email: doc.email || "",
      clinic: doc.clinic || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEditDoctor = () => {
    setEditingDoctorId(null);
    setDocForm({
      name: "",
      specialty: "",
      phone: "",
      email: "",
      clinic: "",
    });
  };

  // ---- SCHOOLS ----
  const submitSchool = async (e) => {
    e.preventDefault();
    try {
      if (editingSchoolId) {
        const res = await axios.put(
          `${API_BASE}/api/admin/schools/${editingSchoolId}`,
          schoolForm,
          { headers: getAuthHeaders() }
        );
        setSchools((prev) =>
          prev.map((s) =>
            (s._id || s.id) === editingSchoolId ? res.data : s
          )
        );
        setEditingSchoolId(null);
      } else {
        const res = await axios.post(
          `${API_BASE}/api/admin/schools`,
          schoolForm,
          { headers: getAuthHeaders() }
        );
        setSchools((prev) => [res.data, ...prev]);
      }
      setSchoolForm({ name: "", location: "", contact: "", phone: "" });
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message || "Failed to save school. Check the data."
      );
    }
  };

  const removeSchool = async (id) => {
    if (!window.confirm("Remove this school?")) return;
    try {
      await axios.delete(`${API_BASE}/api/admin/schools/${id}`, {
        headers: getAuthHeaders(),
      });
      setSchools((prev) => prev.filter((s) => s._id !== id && s.id !== id));
      if (editingSchoolId === id) {
        setEditingSchoolId(null);
        setSchoolForm({ name: "", location: "", contact: "", phone: "" });
      }
    } catch (err) {
      console.error(err);
      alert("Failed to remove school.");
    }
  };

  const startEditSchool = (sch) => {
    setEditingSchoolId(sch._id || sch.id);
    setSchoolForm({
      name: sch.name || "",
      location: sch.location || "",
      contact: sch.contact || "",
      phone: sch.phone || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEditSchool = () => {
    setEditingSchoolId(null);
    setSchoolForm({ name: "", location: "", contact: "", phone: "" });
  };

  // ---- VIDEOS ----
  const submitVideo = async (e) => {
    e.preventDefault();
    try {
      if (editingVideoId) {
        const res = await axios.put(
          `${API_BASE}/api/admin/videos/${editingVideoId}`,
          videoForm,
          { headers: getAuthHeaders() }
        );
        setVideos((prev) =>
          prev.map((v) =>
            (v._id || v.id) === editingVideoId ? res.data : v
          )
        );
        setEditingVideoId(null);
      } else {
        const res = await axios.post(
          `${API_BASE}/api/admin/videos`,
          videoForm,
          { headers: getAuthHeaders() }
        );
        setVideos((prev) => [res.data, ...prev]);
      }
      setVideoForm({ title: "", url: "", notes: "", thumbnail: "" });
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message || "Failed to save video. Check the data."
      );
    }
  };

  const removeVideo = async (id) => {
    if (!window.confirm("Remove this video?")) return;
    try {
      await axios.delete(`${API_BASE}/api/admin/videos/${id}`, {
        headers: getAuthHeaders(),
      });
      setVideos((prev) => prev.filter((v) => v._id !== id && v.id !== id));
      if (editingVideoId === id) {
        setEditingVideoId(null);
        setVideoForm({ title: "", url: "", notes: "", thumbnail: "" });
      }
    } catch (err) {
      console.error(err);
      alert("Failed to remove video.");
    }
  };

  const startEditVideo = (vid) => {
    setEditingVideoId(vid._id || vid.id);
    setVideoForm({
      title: vid.title || "",
      url: vid.url || "",
      notes: vid.notes || "",
      thumbnail: vid.thumbnail || vid.thumbnailUrl || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEditVideo = () => {
    setEditingVideoId(null);
    setVideoForm({ title: "", url: "", notes: "", thumbnail: "" });
  };

  // ---- GAMES ----
  const submitGame = async (e) => {
    e.preventDefault();
    try {
      if (editingGameId) {
        const res = await axios.put(
          `${API_BASE}/api/admin/games/${editingGameId}`,
          gameForm,
          { headers: getAuthHeaders() }
        );
        setGames((prev) =>
          prev.map((g) =>
            (g._id || g.id) === editingGameId ? res.data : g
          )
        );
        setEditingGameId(null);
      } else {
        const res = await axios.post(
          `${API_BASE}/api/admin/games`,
          gameForm,
          { headers: getAuthHeaders() }
        );
        setGames((prev) => [res.data, ...prev]);
      }
      setGameForm({ title: "", url: "", description: "", thumbnail: "" });
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message || "Failed to save game. Check the data."
      );
    }
  };

  const removeGame = async (id) => {
    if (!window.confirm("Remove this game?")) return;
    try {
      await axios.delete(`${API_BASE}/api/admin/games/${id}`, {
        headers: getAuthHeaders(),
      });
      setGames((prev) => prev.filter((g) => g._id !== id && g.id !== id));
      if (editingGameId === id) {
        setEditingGameId(null);
        setGameForm({ title: "", url: "", description: "", thumbnail: "" });
      }
    } catch (err) {
      console.error(err);
      alert("Failed to remove game.");
    }
  };

  const startEditGame = (game) => {
    setEditingGameId(game._id || game.id);
    setGameForm({
      title: game.title || "",
      url: game.url || "",
      description: game.description || "",
      thumbnail: game.thumbnail || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEditGame = () => {
    setEditingGameId(null);
    setGameForm({ title: "", url: "", description: "", thumbnail: "" });
  };

  const logoutAdmin = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin-login");
  };

  const viewChanges = () => {
    navigate("/support");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-700">Admin Panel</h1>
          <div className="flex gap-2">
            <button
              onClick={logoutAdmin}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
            <button
              onClick={viewChanges}
              className="bg-gray-200 text-gray-800 px-3 py-1 rounded"
            >
              View Changes
            </button>
          </div>
        </div>

        {loading && (
          <div className="mb-4 text-sm text-gray-600">Loading data...</div>
        )}
        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white p-3 rounded-lg shadow mb-4 flex gap-3">
          <button
            onClick={() => setTab("doctors")}
            className={`px-4 py-2 rounded ${
              tab === "doctors"
                ? "bg-blue-600 text-white"
                : "bg-blue-50 text-blue-700"
            }`}
          >
            Doctors
          </button>
          <button
            onClick={() => setTab("schools")}
            className={`px-4 py-2 rounded ${
              tab === "schools"
                ? "bg-blue-600 text-white"
                : "bg-blue-50 text-blue-700"
            }`}
          >
            Schools
          </button>
          <button
            onClick={() => setTab("videos")}
            className={`px-4 py-2 rounded ${
              tab === "videos"
                ? "bg-blue-600 text-white"
                : "bg-blue-50 text-blue-700"
            }`}
          >
            ASD Videos
          </button>
          <button
            onClick={() => setTab("games")}
            className={`px-4 py-2 rounded ${
              tab === "games"
                ? "bg-blue-600 text-white"
                : "bg-blue-50 text-blue-700"
            }`}
          >
            Games
          </button>
        </div>

        {/* DOCTORS TAB */}
        {tab === "doctors" && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Add / Edit doctor */}
            <form
              onSubmit={submitDoctor}
              className="bg-white p-4 rounded-xl shadow space-y-3"
            >
              <h2 className="font-semibold text-lg text-blue-700">
                {editingDoctorId ? "Edit Doctor" : "Add Doctor"}
              </h2>
              <input
                className="border p-2 rounded w-full"
                placeholder="Name"
                value={docForm.name}
                onChange={(e) =>
                  setDocForm((f) => ({ ...f, name: e.target.value }))
                }
              />
              <input
                className="border p-2 rounded w-full"
                placeholder="Specialty"
                value={docForm.specialty}
                onChange={(e) =>
                  setDocForm((f) => ({ ...f, specialty: e.target.value }))
                }
              />
              <input
                className="border p-2 rounded w-full"
                placeholder="Clinic / Hospital"
                value={docForm.clinic}
                onChange={(e) =>
                  setDocForm((f) => ({ ...f, clinic: e.target.value }))
                }
              />
              <input
                className="border p-2 rounded w-full"
                placeholder="Phone"
                value={docForm.phone}
                onChange={(e) =>
                  setDocForm((f) => ({ ...f, phone: e.target.value }))
                }
              />
              <input
                className="border p-2 rounded w-full"
                placeholder="Email"
                value={docForm.email}
                onChange={(e) =>
                  setDocForm((f) => ({ ...f, email: e.target.value }))
                }
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  {editingDoctorId ? "Save Changes" : "Add Doctor"}
                </button>
                {editingDoctorId && (
                  <button
                    type="button"
                    onClick={cancelEditDoctor}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            {/* List doctors */}
            <div className="bg-white p-4 rounded-xl shadow">
              <h2 className="font-semibold text-lg text-blue-700 mb-3">
                Doctors List
              </h2>
              {doctors.length === 0 ? (
                <div className="text-sm text-gray-600">
                  No doctors added yet.
                </div>
              ) : (
                <div className="space-y-3 max-h-[420px] overflow-y-auto">
                  {doctors.map((d) => (
                    <div
                      key={d._id || d.id}
                      className="border rounded-lg p-3 flex justify-between items-start gap-3"
                    >
                      <div className="text-sm">
                        <div className="font-semibold">{d.name}</div>
                        <div className="text-gray-600">
                          {d.specialty} • {d.clinic}
                        </div>
                        <div className="text-gray-700 mt-1">
                          Phone: {d.phone}
                          <br />
                          Email: {d.email}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => startEditDoctor(d)}
                          className="text-xs bg-yellow-400 text-gray-800 px-2 py-1 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => removeDoctor(d._id || d.id)}
                          className="text-xs bg-red-500 text-white px-2 py-1 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* SCHOOLS TAB */}
        {tab === "schools" && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Add / Edit school */}
            <form
              onSubmit={submitSchool}
              className="bg-white p-4 rounded-xl shadow space-y-3"
            >
              <h2 className="font-semibold text-lg text-blue-700">
                {editingSchoolId ? "Edit School" : "Add School"}
              </h2>
              <input
                className="border p-2 rounded w-full"
                placeholder="School Name"
                value={schoolForm.name}
                onChange={(e) =>
                  setSchoolForm((f) => ({ ...f, name: e.target.value }))
                }
              />
              <input
                className="border p-2 rounded w-full"
                placeholder="Location"
                value={schoolForm.location}
                onChange={(e) =>
                  setSchoolForm((f) => ({ ...f, location: e.target.value }))
                }
              />
              <input
                className="border p-2 rounded w-full"
                placeholder="Contact Email / Person"
                value={schoolForm.contact}
                onChange={(e) =>
                  setSchoolForm((f) => ({ ...f, contact: e.target.value }))
                }
              />
              <input
                className="border p-2 rounded w-full"
                placeholder="Phone Number"
                value={schoolForm.phone}
                onChange={(e) =>
                  setSchoolForm((f) => ({ ...f, phone: e.target.value }))
                }
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  {editingSchoolId ? "Save Changes" : "Add School"}
                </button>
                {editingSchoolId && (
                  <button
                    type="button"
                    onClick={cancelEditSchool}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            {/* List schools */}
            <div className="bg-white p-4 rounded-xl shadow">
              <h2 className="font-semibold text-lg text-blue-700 mb-3">
                Schools List
              </h2>
              {schools.length === 0 ? (
                <div className="text-sm text-gray-600">
                  No schools added yet.
                </div>
              ) : (
                <div className="space-y-3 max-h-[420px] overflow-y-auto">
                  {schools.map((s) => (
                    <div
                      key={s._id || s.id}
                      className="border rounded-lg p-3 flex justify-between items-start gap-3"
                    >
                      <div className="text-sm">
                        <div className="font-semibold">{s.name}</div>
                        <div className="text-gray-600">{s.location}</div>
                        <div className="text-gray-700 mt-1">
                          Email / Contact: {s.contact}
                          <br />
                          Phone: {s.phone}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => startEditSchool(s)}
                          className="text-xs bg-yellow-400 text-gray-800 px-2 py-1 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => removeSchool(s._id || s.id)}
                          className="text-xs bg-red-500 text-white px-2 py-1 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIDEOS TAB */}
        {tab === "videos" && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Add / Edit video */}
            <form
              onSubmit={submitVideo}
              className="bg-white p-4 rounded-xl shadow space-y-3"
            >
              <h2 className="font-semibold text-lg text-blue-700">
                {editingVideoId ? "Edit Video" : "Add ASD Video"}
              </h2>
              <input
                className="border p-2 rounded w-full"
                placeholder="Title"
                value={videoForm.title}
                onChange={(e) =>
                  setVideoForm((f) => ({ ...f, title: e.target.value }))
                }
              />
              <input
                className="border p-2 rounded w-full"
                placeholder="YouTube URL"
                value={videoForm.url}
                onChange={(e) =>
                  setVideoForm((f) => ({ ...f, url: e.target.value }))
                }
              />
              <input
                className="border p-2 rounded w-full"
                placeholder="Thumbnail Image URL (optional)"
                value={videoForm.thumbnail}
                onChange={(e) =>
                  setVideoForm((f) => ({ ...f, thumbnail: e.target.value }))
                }
              />
              <textarea
                className="border p-2 rounded w-full"
                placeholder="Notes / Description"
                rows={3}
                value={videoForm.notes}
                onChange={(e) =>
                  setVideoForm((f) => ({ ...f, notes: e.target.value }))
                }
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  {editingVideoId ? "Save Changes" : "Add Video"}
                </button>
                {editingVideoId && (
                  <button
                    type="button"
                    onClick={cancelEditVideo}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            {/* List videos */}
            <div className="bg-white p-4 rounded-xl shadow">
              <h2 className="font-semibold text-lg text-blue-700 mb-3">
                Videos List
              </h2>
              {videos.length === 0 ? (
                <div className="text-sm text-gray-600">
                  No videos added yet.
                </div>
              ) : (
                <div className="space-y-3 max-h-[420px] overflow-y-auto">
                  {videos.map((v) => (
                    <div
                      key={v._id || v.id}
                      className="border rounded-lg p-3 flex justify-between items-start gap-3"
                    >
                      <div className="text-sm flex gap-3">
                        {v.thumbnail && (
                          <img
                            src={v.thumbnail}
                            alt={v.title}
                            className="w-16 h-16 rounded object-cover"
                          />
                        )}
                        <div>
                          <div className="font-semibold">{v.title}</div>
                          <div className="text-gray-700 mt-1">{v.notes}</div>
                          {v.url && (
                            <a
                              href={v.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 text-xs underline mt-1 inline-block"
                            >
                              Open video
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => startEditVideo(v)}
                          className="text-xs bg-yellow-400 text-gray-800 px-2 py-1 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => removeVideo(v._id || v.id)}
                          className="text-xs bg-red-500 text-white px-2 py-1 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* GAMES TAB */}
        {tab === "games" && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Add / Edit game */}
            <form
              onSubmit={submitGame}
              className="bg-white p-4 rounded-xl shadow space-y-3"
            >
              <h2 className="font-semibold text-lg text-blue-700">
                {editingGameId ? "Edit Game" : "Add Game"}
              </h2>
              <input
                className="border p-2 rounded w-full"
                placeholder="Game Title"
                value={gameForm.title}
                onChange={(e) =>
                  setGameForm((f) => ({ ...f, title: e.target.value }))
                }
              />
              <input
                className="border p-2 rounded w-full"
                placeholder="Game URL"
                value={gameForm.url}
                onChange={(e) =>
                  setGameForm((f) => ({ ...f, url: e.target.value }))
                }
              />
              <input
                className="border p-2 rounded w-full"
                placeholder="Thumbnail Image URL (optional)"
                value={gameForm.thumbnail}
                onChange={(e) =>
                  setGameForm((f) => ({ ...f, thumbnail: e.target.value }))
                }
              />
              <textarea
                className="border p-2 rounded w-full"
                placeholder="Description (optional)"
                rows={3}
                value={gameForm.description}
                onChange={(e) =>
                  setGameForm((f) => ({
                    ...f,
                    description: e.target.value,
                  }))
                }
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  {editingGameId ? "Save Changes" : "Add Game"}
                </button>
                {editingGameId && (
                  <button
                    type="button"
                    onClick={cancelEditGame}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            {/* List games */}
            <div className="bg-white p-4 rounded-xl shadow">
              <h2 className="font-semibold text-lg text-blue-700 mb-3">
                Games List
              </h2>
              {games.length === 0 ? (
                <div className="text-sm text-gray-600">
                  No games added yet.
                </div>
              ) : (
                <div className="space-y-3 max-h-[420px] overflow-y-auto">
                  {games.map((g) => (
                    <div
                      key={g._id || g.id}
                      className="border rounded-lg p-3 flex justify-between items-start gap-3"
                    >
                      <div className="text-sm flex gap-3">
                        {g.thumbnail && (
                          <img
                            src={g.thumbnail}
                            alt={g.title}
                            className="w-16 h-16 rounded object-cover"
                          />
                        )}
                        <div>
                          <div className="font-semibold">{g.title}</div>
                          <div className="text-gray-700 mt-1">
                            {g.description}
                          </div>
                          {g.url && (
                            <a
                              href={g.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 text-xs underline mt-1 inline-block"
                            >
                              Open game
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => startEditGame(g)}
                          className="text-xs bg-yellow-400 text-gray-800 px-2 py-1 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => removeGame(g._id || g.id)}
                          className="text-xs bg-red-500 text-white px-2 py-1 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
