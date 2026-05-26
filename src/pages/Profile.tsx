import { useState, useEffect, useMemo, useRef } from "react";
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Shield, Camera, Edit3, Settings, FileText, Eye, EyeOff } from "lucide-react";
import "./Profile.css";
import { useAuth } from "../context/AuthContext";

function Profile() {
    const { user, login } = useAuth();
    const [activeTab, setActiveTab] = useState("personal");
    const [isEdit, setIsEdit] = useState(false);
    const [editData, setEditData] = useState(user);
    const firstNameRef = useRef<HTMLInputElement>(null);
    const [isPasswordEdit, setIsPasswordEdit] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);

    useEffect(() => {
        if (isEdit && firstNameRef.current) {
            firstNameRef.current.focus();
        }
    }, [isEdit]);

    const profileData = useMemo(() => {
        return {
            id: editData?.id,
            firstName: editData?.firstName,
            lastName: editData?.lastName,
            email: editData?.email,
            phone: editData?.phone,
            location: editData?.location,
            employeeId: editData?.employeeId,
            joinDate: editData?.joinDate,
            role: editData?.role,
            department: editData?.department,
            status: editData?.status,
            gender: editData?.gender,
            dateOfBirth: editData?.dateOfBirth,
            address: editData?.address,
        }
    }, [editData])
    console.log(profileData);
    useEffect(() => {
        setEditData(user);
    }, [user]);

    const handleSave = () => {
        if (editData) {
            login(editData as any);
        }
        setIsEdit(false);
    }

    const handleCancel = () => {
        setEditData(user);
        setIsEdit(false);
    }

    const handleEditData = (name: string, value: string) => {
        setEditData((prev: any) => prev ? {
            ...prev,
            [name]: value
        } : {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            location: "",
            employeeId: "",
            joinDate: "",
            role: "",
            department: "",
            status: "",
            gender: "",
            dateOfBirth: "",
            address: ""
        })
    }

    const handlePasswordEdit = () => {
        if (isPasswordEdit) {
            handlePasswordCancel();
        } else {
            setIsPasswordEdit(true);
        }
    }

    const handlePasswordSave = () => {
        if (!newPassword || !confirmPassword) {
            alert("Please enter a new password");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        // Simulate API call to save password
        alert("Password successfully updated!");
        handlePasswordCancel();
    }

    const handlePasswordCancel = () => {
        setIsPasswordEdit(false);
        setNewPassword("");
        setConfirmPassword("");
    }

    return (
        <div className="profile-container">
            <div className="profile-header-banner">
                <div className="profile-cover"></div>
                <div className="profile-header-content">
                    <div className="profile-avatar-wrapper">
                        <div className="profile-avatar">
                            <span>{user?.firstName?.charAt(0)}</span>
                            <button className="avatar-edit-btn">
                                <Camera size={14} />
                            </button>
                        </div>
                    </div>
                    <div className="profile-header-info">
                        <h1>{user?.firstName + " " + user?.lastName}</h1>
                        <p>{user?.role} • {user?.department}</p>
                    </div>
                    <div className="profile-header-actions">
                        {isEdit ? (
                            <button onClick={handleCancel} className="btn-outline"><Edit3 size={16} /> Cancel</button>
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
                                    <span>{user?.email}</span>
                                </div>
                            </div>
                            <div className="info-item">
                                <div className="info-icon"><Phone size={16} /></div>
                                <div className="info-text">
                                    <label>Phone Number</label>
                                    <span>{user?.phone}</span>
                                </div>
                            </div>
                            <div className="info-item">
                                <div className="info-icon"><MapPin size={16} /></div>
                                <div className="info-text">
                                    <label>Location</label>
                                    <span>{user?.location}</span>
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
                                    <span>{user?.employeeId}</span>
                                </div>
                            </div>
                            <div className="info-item">
                                <div className="info-icon"><Calendar size={16} /></div>
                                <div className="info-text">
                                    <label>Date of Join</label>
                                    <span>{user?.joinDate}</span>
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
                                        <input ref={firstNameRef} type="text" name="firstName" value={editData?.firstName || ''} readOnly={!isEdit} onChange={(e) => handleEditData(e.target.name, e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>Last Name</label>
                                        <input type="text" name="lastName" value={editData?.lastName || ''} readOnly={!isEdit} onChange={(e) => handleEditData(e.target.name, e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>Date of Birth</label>
                                        <input type="text" name="dateOfBirth" value={editData?.dateOfBirth || ''} readOnly={!isEdit} onChange={(e) => handleEditData(e.target.name, e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>Gender</label>
                                        <input type="text" name="gender" value={editData?.gender || ''} readOnly={!isEdit} onChange={(e) => handleEditData(e.target.name, e.target.value)} />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Address</label>
                                        <textarea name="address" value={editData?.address || ''} readOnly={!isEdit} onChange={(e) => handleEditData(e.target.name, e.target.value)}></textarea>
                                    </div>
                                </div>
                                {isEdit && (
                                    <div className="tab-footer">
                                        <button className="btn-primary" onClick={handleSave}>Save changes</button>
                                        <button className="btn-outline" onClick={handleCancel}>Cancel</button>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="tab-pane">
                                <div className="pane-header">
                                    <h2>Security Settings</h2>
                                    <p>Manage your password and security preferences.</p>
                                </div>
                                <div className="security-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div className="security-info">
                                            <h4>Change Password</h4>
                                            <p>Update your password to keep your account secure.</p>
                                        </div>
                                        <button className="btn-primary" onClick={handlePasswordEdit}>{isPasswordEdit ? "Cancel" : "Update"}</button>
                                    </div>
                                    {isPasswordEdit && (
                                        <div className="form-grid" style={{ width: '100%', marginTop: '20px' }}>
                                            <div className="form-group">
                                                <label>New Password</label>
                                                <div style={{ position: 'relative', width: '100%', display: 'flex' }}>
                                                    <input
                                                        type={showNewPassword ? "text" : "password"}
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                        placeholder="Enter new password"
                                                        style={{ width: '100%', paddingRight: '40px' }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                                        style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
                                                    >
                                                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label>Confirm Password</label>
                                                <div style={{ position: 'relative', width: '100%', display: 'flex' }}>
                                                    <input
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                        placeholder="Confirm new password"
                                                        style={{ width: '100%', paddingRight: '40px' }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
                                                    >
                                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="form-group full-width tab-footer" style={{ marginTop: '10px' }}>
                                                <button className="btn-primary" onClick={handlePasswordSave} style={{ width: 'fit-content' }}>Save Password</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="security-item">
                                    <div className="security-info">
                                        <h4>Two-Factor Authentication (2FA)</h4>
                                        <p>Add an extra layer of security to your account.</p>
                                    </div>
                                    <button
                                        className="btn-outline"
                                        onClick={() => setIs2FAEnabled(!is2FAEnabled)}
                                        style={is2FAEnabled ? { borderColor: 'var(--error-light)', color: '#ef4444' } : {}}
                                    >
                                        {is2FAEnabled ? "Disable" : "Enable"}
                                    </button>
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