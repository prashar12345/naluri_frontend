import React, { useState } from 'react';

const PasswordField = ({ form, setForm, key, className }) => {
    const [eyes, setEyes] = useState({ password: false });
    return <>
        <div className="inputWrapper">
            <input
                type={eyes.password ? 'text' : 'password'}
                className={`form-control ${className}`}
                value={form[key]}
                maxLength={20}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                required
            />
            <i className={eyes.password ? 'fa fa-eye' : 'fa fa-eye-slash'} onClick={() => setEyes({ ...eyes, password: !eyes.password })}></i>
        </div>
    </>
}

export default PasswordField