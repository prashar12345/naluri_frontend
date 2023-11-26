import React, { useEffect, useState } from 'react';
import './style.scss';
import { Link, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import languagesModel from '../../../models/languages.model';
import ApiClient from '../../../methods/api/apiClient';


const Sidebar = () => {
  const user = useSelector(state => state.user)
  const language = useSelector(state => state.language.data)

  const [showRequest, setShowRequest] = useState(true)

  const ListItemLink = ({ to, ...rest }) => {
    return (
      <Route
        path={to}
        children={({ match }) => (
          <li className={match ? 'nav-item active' : 'nav-item'}>
            <Link to={to} {...rest} className="nav-link hoverclass" />
          </li>
        )}
      />
    );
  };

  const requests = () => {
    // setShowRequest(false)
    ApiClient.get('user/appointments', { page: 1, count: 1 }).then(res => {
      if (res.success) {
        if (!res.data.length) setShowRequest(false)
      }
    })
  }

  useEffect(() => {
    requests()
  }, [])


  return (
    <ul className="nav flex-column">




      <ListItemLink to="/dashboard">
        <i className="fa fa-tasks mr-2" aria-hidden="true"></i>
        <span>{languagesModel.translate('dashboard_text', language)}</span>
      </ListItemLink>

      {user && user.role !== 'user' ? <ListItemLink to="/casenotedashboard">
        <i className="fa fa-tasks mr-2" aria-hidden="true"></i>
        <span>{languagesModel.translate('case_note_text', language)}</span>
      </ListItemLink> : <></>}



      {user && user.role === 'Clinic Admin' ? <ListItemLink to="/appointment-types" >
        <i className="fa fa-clock mr-2" aria-hidden="true"></i>
        <span>{languagesModel.translate('appointment_type', language)}</span>
      </ListItemLink> : <></>}

      {user && user.role === 'Clinic Admin' ? <ListItemLink to="/ca-appointments">
        <i className="fa fa-calendar mr-2" aria-hidden="true"></i>
        <span>{languagesModel.translate('consultation_text', language)}</span>
      </ListItemLink> : <></>}
      {user && user.role === 'Counsellor' ? <ListItemLink to="/appointments">
        <i className="fa fa-calendar mr-2" aria-hidden="true"></i>
        <span>{languagesModel.translate('consultation_text', language)}</span>
      </ListItemLink> : <></>}

      {user && user.role === 'user' ? <ListItemLink to="/assessments">
        <i className="fa fa-calendar mr-2" aria-hidden="true"></i>
        <span>{languagesModel.translate('assessments_text', language)}</span>
      </ListItemLink> : <></>}

      {user && user.role === 'user' && showRequest ? <ListItemLink to="/requests">
        <i className="fa fa-calendar mr-2" aria-hidden="true"></i>
        <span>{languagesModel.translate('consultation_text', language)}</span>
      </ListItemLink> : <></>}

      {user && user.role === 'Clinic Admin' ? <ListItemLink to="/counsellors" >
        <i className="fa fa-users mr-2" aria-hidden="true"></i>
        <span>{languagesModel.translate('counsellors_text', language)}</span>
      </ListItemLink> : <></>}

      {user && user.role !== 'user' ? <ListItemLink to="/audittrail">
        <i className="fa fa-calendar mr-2" aria-hidden="true"></i>
        <span>{languagesModel.translate('audit_trail_text', language)}</span>
      </ListItemLink> : <></>}
      {/* {user && user.role !== 'user' ? <Link to='audittrail'>Audit Trail</Link>
        : <></>} */}
      {user && (user.role === 'Counsellor' || user.role === 'Clinic Admin') ? <ListItemLink to="/users" >
        <i className="fa fa-users mr-2" aria-hidden="true"></i>
        <span>{languagesModel.translate('users_text', language)}</span>
      </ListItemLink> : <></>}
    </ul>
  );
};

export default Sidebar;
