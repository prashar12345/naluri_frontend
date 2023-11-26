import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Layout from '../../components/global/layout';
import EditProfile from '../../components/Profile/Edit';
import ChangePassword from '../../components/Profile/ChangePassword';
import AppointmentReminder from '../../components/Profile/AppointmentReminder';
import languagesModel from '../../models/languages.model';

const Settings = () => {

  const language = useSelector(state => state.language.data)
  const [tabs, setTabs] = useState('profile');
  const user = useSelector(state => state.user)
  return (
    <>
      <Layout>
        <div className='container'>
          <h3 className="mb-3 settinghedding">{languagesModel.translate('settings_menu', language)}</h3>

          <ul className="nav nav-tabs">
            <li className="nav-item">
              <a
                className={tabs == 'profile' ? 'nav-link active' : 'nav-link'}
                href="#"
                onClick={() => setTabs('profile')}
              >
                {languagesModel.translate('edit_profile', language)}
              </a>
            </li>
            <li className="nav-item">
              <a
                className={
                  tabs == 'change-pass' ? 'nav-link active' : 'nav-link'
                }
                href="#"
                onClick={() => setTabs('change-pass')}
              >
                {languagesModel.translate('change_password', language)}
              </a>
            </li>
            {
              user.role === 'Clinic Admin' ? <li className="nav-item">
                <a
                  className={
                    tabs == 'Reminder' ? 'nav-link active' : 'nav-link'
                  }
                  href="#"
                  onClick={() => setTabs('Reminder')}
                >
                  {languagesModel.translate('appointment_reminder', language)}
                </a>
              </li> : <></>
            }
          </ul>
          <div>
            {tabs === 'profile' ? <EditProfile /> : <></>}
            {tabs === 'change-pass' ? <ChangePassword /> : <></>}
            {tabs === 'Reminder' ? < AppointmentReminder /> : <></>}

          </div>
        </div>

      </Layout>
    </>
  );
};

export default Settings;
