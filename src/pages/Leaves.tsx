import { useState, useEffect } from "react";
import { 
  Plus, 
  Calendar, 
  Clock, 
  MoreVertical, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  FileText,
  X,
  ChevronRight
} from "lucide-react";
import "./Leaves.css";

interface Leave {
  id: number;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  appliedDate: string;
}

interface LeaveBalances {
  sick: number;
  casual: number;
  paid: number;
  unpaid: number;
}

function Leaves() {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [balances, setBalances] = useState<LeaveBalances>({ sick: 0, casual: 0, paid: 0, unpaid: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    type: "Sick Leave",
    startDate: "",
    endDate: "",
    reason: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [leavesRes, balancesRes] = await Promise.all([
        fetch("http://localhost:3001/leaves"),
        fetch("http://localhost:3001/leave_balances")
      ]);
      const leavesData = await leavesRes.json();
      const balancesData = await balancesRes.json();
      setLeaves(leavesData.reverse());
      setBalances(balancesData);
    } catch (error) {
      console.error("Error fetching leave data:", error);
    }
  };

  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const diffTime = Math.abs(new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const newLeave = {
      type: formData.type,
      startDate: formData.startDate,
      endDate: formData.endDate,
      days: diffDays,
      reason: formData.reason,
      status: "Pending",
      appliedDate: new Date().toISOString().split('T')[0]
    };

    try {
      const res = await fetch("http://localhost:3001/leaves", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLeave)
      });

      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ type: "Sick Leave", startDate: "", endDate: "", reason: "" });
        fetchData();
      }
    } catch (error) {
      console.error("Error applying for leave:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return <CheckCircle2 size={14} />;
      case 'Rejected': return <XCircle size={14} />;
      default: return <AlertCircle size={14} />;
    }
  };

  return (
    <div className="leaves-page">
      <header className="leaves-header">
        <div className="header-content">
          <h1>Leave Management</h1>
          <p className="text-muted">Track your balances and request time off</p>
        </div>
        <button className="apply-leave-btn" onClick={() => setIsModalOpen(true)}>
          <Plus size={20} />
          Apply for Leave
        </button>
      </header>

      {/* Balance Cards */}
      <section className="balances-grid">
        <div className="balance-card" style={{ '--card-accent': '#ef4444' } as any}>
          <div className="balance-info">
            <h3>Sick Leaves</h3>
            <div className="balance-value">{balances.sick}</div>
          </div>
          <div className="balance-footer">Available Days</div>
        </div>
        <div className="balance-card" style={{ '--card-accent': '#f97316' } as any}>
          <div className="balance-info">
            <h3>Casual Leaves</h3>
            <div className="balance-value">{balances.casual}</div>
          </div>
          <div className="balance-footer">Available Days</div>
        </div>
        <div className="balance-card" style={{ '--card-accent': '#22c55e' } as any}>
          <div className="balance-info">
            <h3>Paid Leaves</h3>
            <div className="balance-value">{balances.paid}</div>
          </div>
          <div className="balance-footer">Accrued this year</div>
        </div>
        <div className="balance-card" style={{ '--card-accent': '#6366f1' } as any}>
          <div className="balance-info">
            <h3>Total Taken</h3>
            <div className="balance-value">{leaves.filter(l => l.status === 'Approved').reduce((acc, curr) => acc + curr.days, 0)}</div>
          </div>
          <div className="balance-footer">Days utilized</div>
        </div>
      </section>

      {/* Leave History */}
      <div className="leaves-history-card">
        <div className="card-header">
          <h2>Leave History</h2>
          <div className="header-actions">
            <button className="icon-btn"><MoreVertical size={18} /></button>
          </div>
        </div>
        <div className="leaves-table-container">
          <table className="leaves-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Dates</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaves.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '40px' }}>
                    <div className="empty-state">
                      <FileText size={48} opacity={0.2} />
                      <p>No leave applications found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                leaves.map((leave) => (
                  <tr key={leave.id}>
                    <td>
                      <div className="leave-type-cell">
                        <div className="type-icon">
                          {leave.type.includes('Sick') ? <AlertCircle size={18} /> : <Calendar size={18} />}
                        </div>
                        <div className="type-info">
                          <div className="type-name">{leave.type}</div>
                          <div className="applied-on">Applied: {leave.appliedDate}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="date-range">
                        <div className="dates">{leave.startDate} to {leave.endDate}</div>
                        <div className="duration">{leave.days} Day{leave.days > 1 ? 's' : ''}</div>
                      </div>
                    </td>
                    <td className="reason-cell">
                      <div className="reason-text" title={leave.reason}>{leave.reason}</div>
                    </td>
                    <td>
                      <span className={`status-badge ${leave.status.toLowerCase()}`}>
                        {getStatusIcon(leave.status)}
                        {leave.status}
                      </span>
                    </td>
                    <td>
                      <button className="icon-btn"><ChevronRight size={18} /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Leave Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="leave-modal">
            <div className="modal-header">
              <h2>New Leave Request</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <form className="leave-form" onSubmit={handleApplyLeave}>
                <div className="form-group">
                  <label>Leave Type</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    required
                  >
                    <option>Sick Leave</option>
                    <option>Casual Leave</option>
                    <option>Paid Leave</option>
                    <option>Unpaid Leave</option>
                  </select>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Start Date</label>
                    <input 
                      type="date" 
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>End Date</label>
                    <input 
                      type="date" 
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Reason for Leave</label>
                  <textarea 
                    rows={4} 
                    placeholder="Briefly describe the reason..."
                    value={formData.reason}
                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="submit-btn" disabled={isLoading}>
                  {isLoading ? "Submitting..." : "Submit Request"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Leaves;