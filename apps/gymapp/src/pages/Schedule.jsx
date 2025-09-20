import { useState, useMemo } from "react";

export default function Schedule() {
  const [currentDate] = useState(new Date());
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [formData, setFormData] = useState({
    client: "",
    title: "",
    date: "",
    time: "",
    duration: "60",
    location: "Studio 1",
    notes: ""
  });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Mock events (Agenda below calendar)
  const events = [
    {
      id: 1,
      client: "Sarah K",
      title: "Leg Day (Gym Floor)",
      time: "6:00 PM",
      location: "Studio 2",
      action: "Reschedule",
    },
    {
      id: 2,
      client: "Jessica T",
      title: "Cardio & Core",
      time: "7:00 AM",
      location: "Studio 1",
      action: "Message",
    },
  ];

  // ✅ Helper: Get initials from name (e.g., "Sarah K" → "SK")
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const daysInMonth = (date) => {
    const d = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return d.getDate();
  };

  const today = new Date();

  const dates = useMemo(() => {
    const numDays = daysInMonth(currentDate);
    return Array.from({ length: numDays }, (_, i) => i + 1);
  }, [currentDate]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear any previous errors when typing
    if (formError) setFormError("");
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.client.trim()) {
      setFormError("Client name is required");
      return;
    }
    if (!formData.title.trim()) {
      setFormError("Session title is required");
      return;
    }
    if (!formData.date) {
      setFormError("Date is required");
      return;
    }
    if (!formData.time) {
      setFormError("Time is required");
      return;
    }

    // Simulate form submission
    setFormError("");
    setFormSuccess("Session scheduled successfully!");
    
    // Reset form after 2 seconds
    setTimeout(() => {
      setFormData({
        client: "",
        title: "",
        date: "",
        time: "",
        duration: "60",
        location: "Studio 1",
        notes: ""
      });
      setFormSuccess("");
      setShowScheduleForm(false);
    }, 2000);
    
    console.log("Form submitted:", formData);
  };

  // Close form
  const closeForm = () => {
    setShowScheduleForm(false);
    setFormError("");
    setFormSuccess("");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Session Schedule</h1>
        <button 
          onClick={() => setShowScheduleForm(true)}
          className="bg-gradient-to-r from-teal-500 to-teal-600 px-4 py-2 rounded-lg font-medium shadow-md hover:from-teal-600 hover:to-teal-700 transition-all duration-200 transform hover:scale-105"
        >
          + Schedule New Session
        </button>
      </div>

      {/* Schedule Form Modal */}
      {showScheduleForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Schedule New Session</h2>
                <button 
                  onClick={closeForm}
                  className="text-gray-400 hover:text-white text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              
              {formError && (
                <div className="mb-4 p-3 bg-red-600 text-white rounded-lg">
                  {formError}
                </div>
              )}
              
              {formSuccess && (
                <div className="mb-4 p-3 bg-green-600 text-white rounded-lg">
                  {formSuccess}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Client Name *
                    </label>
                    <input
                      type="text"
                      name="client"
                      value={formData.client}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-teal-500 focus:outline-none"
                      placeholder="Enter client name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Session Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-teal-500 focus:outline-none"
                      placeholder="e.g., Upper Body Strength"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Date *
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-teal-500 focus:outline-none"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Time *
                      </label>
                      <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-teal-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Duration (minutes)
                      </label>
                      <select
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-teal-500 focus:outline-none"
                      >
                        <option value="30">30 minutes</option>
                        <option value="45">45 minutes</option>
                        <option value="60">60 minutes</option>
                        <option value="75">75 minutes</option>
                        <option value="90">90 minutes</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Location
                      </label>
                      <select
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-teal-500 focus:outline-none"
                      >
                        <option value="Studio 1">Studio 1</option>
                        <option value="Studio 2">Studio 2</option>
                        <option value="Gym Floor">Gym Floor</option>
                        <option value="Outdoor">Outdoor</option>
                        <option value="Online">Online</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-teal-500 focus:outline-none"
                      placeholder="Add any special instructions or notes..."
                    />
                  </div>
                </div>
                
                <div className="flex gap-4 mt-8">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="flex-1 px-4 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-medium transition-all duration-200 transform hover:scale-105"
                  >
                    Schedule Session
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Calendar */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700 mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold">
              {getInitials("Coach")}
            </div>
            <span className="font-medium">
              {currentDate.toLocaleString("default", { month: "long" })}{" "}
              {currentDate.getFullYear()}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2 text-center text-gray-300 mb-2">
          {weekDays.map((day) => (
            <div key={day} className="font-medium text-sm">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {dates.map((day) => (
            <div
              key={day}
              className={`p-3 rounded-lg flex items-center justify-center cursor-pointer text-sm font-medium transition-all duration-200 ${
                today.getDate() === day &&
                today.getMonth() === currentDate.getMonth()
                  ? "bg-teal-500 text-black font-bold shadow-md"
                  : "bg-gray-700 hover:bg-gray-650"
              }`}
            >
              {day}
            </div>
          ))}
        </div>
      </div>

      {/* Daily Agenda */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4">Daily Agenda</h2>
        <p className="text-sm text-gray-400 mb-4">Upcoming Week View</p>
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between bg-gray-700 p-4 rounded-lg hover:bg-gray-650 transition-all duration-200"
            >
              {/* Left */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg">
                  {getInitials(event.client)}
                </div>
                <div>
                  <p className="font-semibold text-white">{event.client}</p>
                  <p className="text-sm text-gray-300">{event.title}</p>
                  <p className="text-xs text-gray-400">
                    {event.time} · {event.location}
                  </p>
                </div>
              </div>
              {/* Right */}
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-md ${
                  event.action === "Message"
                    ? "bg-teal-600 hover:bg-teal-500"
                    : "bg-teal-600 hover:bg-teal-500"
                }`}
              >
                {event.action}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}