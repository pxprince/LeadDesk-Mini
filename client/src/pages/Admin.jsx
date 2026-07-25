import "../Admin.css";
import { useEffect, useState } from "react";

function Admin() {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");

  const totalLeads = leads.length;
  const newLeads = leads.filter((lead) => lead.status === "New").length;
  const contactedLeads = leads.filter(
    (lead) => lead.status === "Contacted"
  ).length;
  const closedLeads = leads.filter(
    (lead) => lead.status === "Closed"
  ).length;

  // Load all leads
  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      const res = await fetch("http://localhost:5000/leads");
      const result = await res.json();

      if (result.success) {
        setLeads(result.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Update Lead Status
  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5000/leads/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const result = await res.json();

      if (result.success) {
        setLeads((prev) =>
          prev.map((lead) =>
            lead.id === id ? { ...lead, status } : lead
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Lead
  const deleteLead = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this lead?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:5000/leads/${id}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (result.success) {
        setLeads((prev) => prev.filter((lead) => lead.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">LeadDesk Admin Dashboard</h1>

      <input
        type="text"
        className="search-box"
        placeholder="Search by Name or Email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <p className="total">Total Leads: {totalLeads}</p>

      <div className="cards">
        <div className="card total-card">
          <h3>Total</h3>
          <p>{totalLeads}</p>
        </div>

        <div className="card new-card">
          <h3>New</h3>
          <p>{newLeads}</p>
        </div>

        <div className="card contacted-card">
          <h3>Contacted</h3>
          <p>{contactedLeads}</p>
        </div>

        <div className="card closed-card">
          <h3>Closed</h3>
          <p>{closedLeads}</p>
        </div>
      </div>

      <table
        border="1"
        cellPadding="10"
        style={{ borderCollapse: "collapse", width: "100%" }}
      >
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Budget</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {leads
            .filter(
              (lead) =>
                lead.name.toLowerCase().includes(search.toLowerCase()) ||
                lead.email.toLowerCase().includes(search.toLowerCase())
            )
            .map((lead) => (
              <tr key={lead.id}>
                <td>{lead.name}</td>
                <td>{lead.email}</td>
                <td>{lead.budget}</td>

                <td>
                  <select
                    value={lead.status}
                    onChange={(e) =>
                      updateStatus(lead.id, e.target.value)
                    }
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Closed">Closed</option>
                  </select>
                </td>

                <td>
                  <button
                    className="delete-btn"
                    onClick={() => deleteLead(lead.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default Admin;