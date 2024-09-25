import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAppointments } from '../../redux/slices/appointmentsSlice';
import { Calendar, MessageSquare, Users, Activity, Sun, ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { motion } from 'framer-motion';

const InformationMain = () => {
  const dispatch = useDispatch();
  const { appointmentsData, status, error } = useSelector((state) => state.appointments);
  const { total_appointments, total_patients, appointments } = appointmentsData;

  const [doctorName, setDoctorName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [appointmentsPerPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      const storedUser = sessionStorage.getItem('user');
      const userObject = JSON.parse(storedUser);
      const doctorId = userObject.id;

      setDoctorName(userObject.name);
      dispatch(fetchAppointments(doctorId));
    };

    fetchData();
  }, [dispatch]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  // Get current appointments
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = appointments.slice(indexOfFirstAppointment, indexOfLastAppointment);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="rounded-xl min-h-screen mt-12"
    >
      <div className="rounded-xl shadow-lg bg-gradient-to-br from-gray-100 to-gray-200 p-10">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <motion.div initial={{ x: -20 }} animate={{ x: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              Good Morning <Sun className="ml-2 text-yellow-500" />
            </h1>
            <h2 className="text-2xl font-semibold text-blue-600">{doctorName ? `Dr. ${doctorName}` : 'Doctor'}</h2>
            <p className="text-gray-600 flex items-center">Have a nice day at work <Activity className="ml-2 text-green-500" size={16} /></p>
          </motion.div>
        </header>

        {/* Weekly Reports */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            Weekly Reports <ChevronRight className="ml-2" size={20} />
          </h3>
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ReportCard icon={<Calendar className="text-teal-500" />} title="Total Patients" value={total_patients} color="bg-teal-100" />
            <ReportCard icon={<MessageSquare className="text-yellow-500" />} title="New Calls" value="260" color="bg-yellow-100" />
            <ReportCard icon={<Users className="text-red-500" />} title="Appointments" value={total_appointments} color="bg-red-100" />
            <ReportCard icon={<Activity className="text-blue-500" />} title="Annual Plan" value="321" color="bg-blue-100" />
          </motion.div>
        </section>

        {/* Today's Appointments */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold flex items-center">Today's Appointment <Calendar className="ml-2 text-blue-500" size={20} /></h3>
          </div>
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-600 bg-gray-50">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Gender</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {currentAppointments.map((appointment) => (
                  <AppointmentRow
                    key={appointment.appointment_id}
                    name={appointment.patient_name}
                    gender="Female"  // Assuming this data is not provided by the API
                    date={appointment.appointment_date}
                    time={appointment.appointment_time}
                    status={appointment.status}
                  />
                ))}
              </tbody>
            </table>
          </motion.div>
          <Pagination
            appointmentsPerPage={appointmentsPerPage}
            totalAppointments={appointments.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </section>
      </div>
    </motion.div>
  );
};

const ReportCard = ({ icon, title, value, color }) => (
  <motion.div 
    whileHover={{ scale: 1.05 }}
    className={`${color} p-4 rounded-lg flex items-center space-x-4 shadow-sm`}
  >
    <div className="p-3 bg-white rounded-full shadow-inner">{icon}</div>
    <div>
      <p className="text-gray-600">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </motion.div>
);

const AppointmentRow = ({ name, gender, date, time, status }) => (
  <motion.tr 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
    className="border-b border-gray-200 hover:bg-gray-50"
  >
    <td className="py-4 px-4 flex items-center">
      <div className="ml-3">
        <p className="font-semibold">{name}</p>
      </div>
    </td>
    <td className="py-4 px-4">{gender}</td>
    <td className="py-4 px-4">{date}</td>
    <td className="py-4 px-4">{time}</td>
    <td className="py-4 px-4">
      <span className={`text-sm px-2 py-1 rounded-full ${status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
        {status}
      </span>
    </td>
  </motion.tr>
);

const Pagination = ({ appointmentsPerPage, totalAppointments, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalAppointments / appointmentsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="flex justify-center mt-4">
      <ul className="flex">
        <li>
          <button
            onClick={() => paginate(1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-l-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
          >
            <ChevronsLeft size={20} />
          </button>
        </li>
        <li>
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
          >
            <ChevronLeft size={20} />
          </button>
        </li>
        {pageNumbers.map(number => (
          <li key={number}>
            <button
              onClick={() => paginate(number)}
              className={`px-3 py-1 ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              {number}
            </button>
          </li>
        ))}
        <li>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === Math.ceil(totalAppointments / appointmentsPerPage)}
            className="px-3 py-1 bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
          >
            <ChevronRight size={20} />
          </button>
        </li>
        <li>
          <button
            onClick={() => paginate(Math.ceil(totalAppointments / appointmentsPerPage))}
            disabled={currentPage === Math.ceil(totalAppointments / appointmentsPerPage)}
            className="px-3 py-1 rounded-r-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
          >
            <ChevronsRight size={20} />
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default InformationMain;