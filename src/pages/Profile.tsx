import { useState, useEffect, useMemo } from "react";
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Shield, Camera, Edit3, Settings, FileText } from "lucide-react";
import "./Profile.css";
import { useAuth } from "../context/AuthContext";

function Profile() {
    const { user } = useAuth();

    console.log(user);

    useState({
        id: user?.id,
        name: user?.name,
        email: user?.email,
        phone: user?.phone,
        location: user?.location,
        employeeId: user?.employeeId,
        joinDate: user?.joinDate,
        role: user?.role,
        department: user?.department,
        status: user?.status,
    })

    const [activeTab, setActiveTab] = useState("personal");
    const [isEdit, setIsEdit] = useState(false);
    const [editData, setEditData] = useState(user);

    const profileData = useMemo(() => {
        return {
            id: user?.id,
            name: user?.name,
            email: editData?.email,
            phone: editData?.phone,
            location: editData?.location,
            employeeId: editData?.employeeId,
            joinDate: editData?.joinDate,
            role: user?.role,
            department: editData?.department,
            status: editData?.status,
        }
    }, [editData])
    console.log(profileData);
    useEffect(() => {
        setEditData(user);
    }, [user]);

    return (
        <div className="profile-container">
            <div className="profile-header-banner">
                <div className="profile-cover"></div>
                <div className="profile-header-content">
                    <div className="profile-avatar-wrapper">
                        <div className="profile-avatar">
                            <span>{editData?.name.charAt(0)}</span>
                            <button className="avatar-edit-btn">
                                <Camera size={14} />
                            </button>
                        </div>
                    </div>
                    <div className="profile-header-info">
                        <h1>{editData?.name}</h1>
                        <p>{editData?.role} • {editData?.department}</p>
                    </div>
                    <div className="profile-header-actions">
                        {isEdit ? (
                            <button onClick={() => setIsEdit(false)} className="btn-outline"><Edit3 size={16} /> Cancel</button>
                        ) : (
                            <button onClick={() => setIsEdit(true)} className="btn-outline"><Edit3 size={16} /> Edit Profile</button>
                        )}
                    </div>
                </div>
            </div>

            <div className="profile-content-grid">
                <div className="profile-sidebar">
                    <div className="profile-card">
                        <h3>Contact Information</h3>
                        <div className="info-list">
                            <div className="info-item">
                                <div className="info-icon"><Mail size={16} /></div>
                                <div className="info-text">
                                    <label>Email Address</label>
                                    <span>{editData?.email}</span>
                                </div>
                            </div>
                            <div className="info-item">
                                <div className="info-icon"><Phone size={16} /></div>
                                <div className="info-text">
                                    <label>Phone Number</label>
                                    <span>{editData?.phone}</span>
                                </div>
                            </div>
                            <div className="info-item">
                                <div className="info-icon"><MapPin size={16} /></div>
                                <div className="info-text">
                                    <label>Location</label>
                                    <span>{editData?.location}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="profile-card">
                        <h3>Work Details</h3>
                        <div className="info-list">
                            <div className="info-item">
                                <div className="info-icon"><Briefcase size={16} /></div>
                                <div className="info-text">
                                    <label>Employee ID</label>
                                    <span>{editData?.employeeId}</span>
                                </div>
                            </div>
                            <div className="info-item">
                                <div className="info-icon"><Calendar size={16} /></div>
                                <div className="info-text">
                                    <label>Date of Join</label>
                                    <span>{editData?.joinDate}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="profile-main">
                    <div className="profile-tabs">
                        <button
                            className={`profile-tab ${activeTab === 'personal' ? 'active' : ''}`}
                            onClick={() => setActiveTab('personal')}
                        >
                            <User size={16} /> Personal Info
                        </button>
                        <button
                            className={`profile-tab ${activeTab === 'security' ? 'active' : ''}`}
                            onClick={() => setActiveTab('security')}
                        >
                            <Shield size={16} /> Security
                        </button>
                        <button
                            className={`profile-tab ${activeTab === 'documents' ? 'active' : ''}`}
                            onClick={() => setActiveTab('documents')}
                        >
                            <FileText size={16} /> Documents
                        </button>
                        <button
                            className={`profile-tab ${activeTab === 'settings' ? 'active' : ''}`}
                            onClick={() => setActiveTab('settings')}
                        >
                            <Settings size={16} /> Preferences
                        </button>
                    </div>

                    <div className="profile-tab-content">
                        {activeTab === 'personal' && (
                            <div className="tab-pane">
                                <div className="pane-header">
                                    <h2>Personal Information</h2>
                                    <p>Manage your personal details and demographics.</p>
                                </div>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>First Name</label>
                                        <input type="text" value={user?.name.split(' ')[0]} readOnly />
                                    </div>
                                    <div className="form-group">
                                        <label>Last Name</label>
                                        <input type="text" value={user?.name.split(' ')[1] || ''} readOnly />
                                    </div>
                                    <div className="form-group">
                                        <label>Date of Birth</label>
                                        <input type="text" value="August 24, 1990" readOnly />
                                    </div>
                                    <div className="form-group">
                                        <label>Gender</label>
                                        <input type="text" value="Male" readOnly />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Address</label>
                                        <textarea readOnly value="123 Innovation Drive, Tech District&#10;San Francisco, CA 94105"></textarea>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="tab-pane">
                                <div className="pane-header">
                                    <h2>Security Settings</h2>
                                    <p>Manage your password and security preferences.</p>
                                </div>
                                <div className="security-item">
                                    <div className="security-info">
                                        <h4>Change Password</h4>
                                        <p>Update your password to keep your account secure.</p>
                                    </div>
                                    <button className="btn-primary">Update</button>
                                </div>
                                <div className="security-item">
                                    <div className="security-info">
                                        <h4>Two-Factor Authentication (2FA)</h4>
                                        <p>Add an extra layer of security to your account.</p>
                                    </div>
                                    <button className="btn-outline">Enable</button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'documents' && (
                            <div className="tab-pane">
                                <div className="pane-header">
                                    <h2>My Documents</h2>
                                    <p>View and manage your employment documents.</p>
                                </div>
                                <div className="empty-state">
                                    <FileText size={48} />
                                    <p>No documents uploaded yet.</p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="tab-pane">
                                <div className="pane-header">
                                    <h2>Preferences</h2>
                                    <p>Customize your HRMS experience.</p>
                                </div>
                                <div className="form-group full-width">
                                    <label>Language</label>
                                    <select>
                                        <option>English (US)</option>
                                        <option>Spanish</option>
                                        <option>French</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;