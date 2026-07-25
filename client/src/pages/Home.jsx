import { useState } from "react";
import "../App.css";

function Home() {
  const [formData, setFormData] = useState({
  name: "",
  email: "",
  budget: "",
  message: "",
});

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};

const handleSubmit = async (e) => {
  e.preventDefault();

  if (
    !formData.name ||
    !formData.email ||
    !formData.budget ||
    !formData.message
  ) {
    alert("Please fill all fields");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (result.success) {
      alert("Lead Submitted Successfully!");

      setFormData({
        name: "",
        email: "",
        budget: "",
        message: "",
      });
    } else {
      alert(result.error);
    }
  } catch (error) {
    console.error(error);
    alert("Server Error");
  }
};
  return (
    <div className="container">
      <nav className="navbar">
        <h2>LeadDesk Mini</h2>
        <button>Admin</button>
      </nav>

      <section className="hero">
        <h1>Grow Your Business with Quality Leads</h1>
        <p>
          Capture leads easily and manage them from a powerful admin dashboard.
        </p>

        <form className="form-card" onSubmit={handleSubmit}>
  <input
    type="text"
    name="name"
    placeholder="Your Name"
    value={formData.name}
    onChange={handleChange}
  />

  <input
    type="email"
    name="email"
    placeholder="Email Address"
    value={formData.email}
    onChange={handleChange}
  />

  <select
    name="budget"
    value={formData.budget}
    onChange={handleChange}
  >
    <option value="">Select Budget</option>
    <option>Below ₹10,000</option>
    <option>₹10,000 - ₹50,000</option>
    <option>₹50,000+</option>
  </select>

  <textarea
    rows="5"
    name="message"
    placeholder="Tell us about your project"
    value={formData.message}
    onChange={handleChange}
  ></textarea>

  <button className="submit-btn" type="submit">
    Submit Lead
  </button>
</form>
      </section>
    </div>
  );
}

export default Home;