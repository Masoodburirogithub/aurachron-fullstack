// src/pages/Admin/DemoRequestsManager.jsx

import React, { useState, useEffect } from 'react';
import {
  FiMail,
  FiPhone,
  FiEye,
  FiTrash2,
  FiLoader
} from 'react-icons/fi';

import { demoAPI } from '../../services/api';
import toast from 'react-hot-toast';

const DemoRequestsManager = () => {

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  // FETCH ALL REQUESTS
  const fetchRequests = async () => {
    try {

      setLoading(true);

      const response = await demoAPI.getAllDemoRequests();

      if (response.data?.success) {
        setRequests(response.data.data);
      }

    } catch (error) {

      console.error('Error fetching demo requests:', error);
      toast.error('Failed to load requests');

    } finally {

      setLoading(false);

    }
  };

  // UPDATE STATUS
  const updateStatus = async (id, status) => {

    try {

      await demoAPI.updateDemoRequestStatus(id, status);

      toast.success(`Status updated to ${status}`);

      fetchRequests();

    } catch (error) {

      toast.error('Failed to update status');

    }
  };

  // DELETE REQUEST
  const deleteRequest = async (id) => {

    const confirmDelete = window.confirm(
      'Are you sure you want to delete this request?'
    );

    if (!confirmDelete) return;

    try {

      await demoAPI.deleteDemoRequest(id);

      toast.success('Request deleted');

      fetchRequests();

    } catch (error) {

      toast.error('Failed to delete request');

    }
  };

  // STATUS BADGES
  const getStatusBadge = (status) => {

    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      contacted: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800'
    };

    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  // LOADING
  if (loading) {

    return (
      <div className="flex items-center justify-center h-64">
        <FiLoader className="w-8 h-8 animate-spin text-[#F59E0B]" />
      </div>
    );
  }

  return (

    <div>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">

        <div>

          <h1 className="text-2xl font-bold text-gray-900">
            Demo Requests
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Manage demo requests from potential clients
          </p>

        </div>

      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[900px]">

            {/* TABLE HEADER */}
            <thead className="bg-gray-50 border-b">

              <tr>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Company
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Contact
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Job Title
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Submitted
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>

              </tr>

            </thead>

            {/* TABLE BODY */}
            <tbody className="divide-y divide-gray-100">

              {requests.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"
                    className="px-4 py-8 text-center text-gray-400"
                  >
                    No demo requests yet
                  </td>

                </tr>

              ) : (

                requests.map((req) => (

                  <tr
                    key={req.id}
                    className="hover:bg-gray-50 transition"
                  >

                    {/* COMPANY */}
                    <td className="px-4 py-3">

                      <div className="font-medium text-gray-900">
                        {req.company}
                      </div>

                    </td>

                    {/* CONTACT */}
                    <td className="px-4 py-3">

                      <div className="font-medium">
                        {req.firstName} {req.lastName}
                      </div>

                      <div className="text-sm text-gray-500">
                        {req.businessEmail}
                      </div>

                      <div className="text-sm text-gray-500">
                        {req.phoneNumber}
                      </div>

                    </td>

                    {/* JOB TITLE */}
                    <td className="px-4 py-3 text-gray-600">

                      {req.jobTitle}

                    </td>

                    {/* STATUS */}
                    <td className="px-4 py-3">

                      <select
                        value={req.status}
                        onChange={(e) =>
                          updateStatus(req.id, e.target.value)
                        }
                        className={`px-3 py-1 rounded-full text-xs font-medium border-0 focus:ring-1 focus:ring-[#F59E0B] ${getStatusBadge(req.status)}`}
                      >
                        <option value="pending">
                          Pending
                        </option>

                        <option value="contacted">
                          Contacted
                        </option>

                        <option value="completed">
                          Completed
                        </option>

                      </select>

                    </td>

                    {/* CREATED DATE */}
                    <td className="px-4 py-3 text-sm text-gray-500">

                      {new Date(req.createdAt).toLocaleDateString()}

                    </td>

                    {/* ACTIONS */}
                    <td className="px-4 py-3">

                      <div className="flex items-center gap-3">

                        {/* VIEW */}
                        <button
                          onClick={() => {
                            setSelectedRequest(req);
                            setShowModal(true);
                          }}
                          className="text-[#F59E0B] hover:text-[#B45309] transition"
                          title="View Details"
                        >
                          <FiEye size={16} />
                        </button>

                        {/* EMAIL */}
                        <a
                          href={`mailto:${req.businessEmail}`}
                          className="text-blue-600 hover:text-blue-800 transition"
                          title="Send Email"
                        >
                          <FiMail size={16} />
                        </a>

                        {/* PHONE */}
                        <a
                          href={`tel:${req.phoneNumber}`}
                          className="text-green-600 hover:text-green-800 transition"
                          title="Call"
                        >
                          <FiPhone size={16} />
                        </a>

                        {/* DELETE */}
                        <button
                          onClick={() => deleteRequest(req.id)}
                          className="text-red-600 hover:text-red-800 transition"
                          title="Delete"
                        >
                          <FiTrash2 size={16} />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))
              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* MODAL */}
      {showModal && selectedRequest && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-xl max-w-md w-full max-h-[85vh] overflow-hidden shadow-xl">

            {/* MODAL HEADER */}
            <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-[#1E3A8A] to-[#1E40AF] text-white">

              <h2 className="text-xl font-bold">
                Demo Request Details
              </h2>

              <button
                onClick={() => setShowModal(false)}
                className="text-white/80 hover:text-white text-2xl"
              >
                &times;
              </button>

            </div>

            {/* MODAL BODY */}
            <div className="p-6 space-y-5">

              <div className="grid grid-cols-2 gap-4">

                {/* COMPANY */}
                <div>

                  <p className="text-gray-500 text-xs">
                    Company
                  </p>

                  <p className="font-medium">
                    {selectedRequest.company}
                  </p>

                </div>

                {/* STATUS */}
                <div>

                  <p className="text-gray-500 text-xs">
                    Status
                  </p>

                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(selectedRequest.status)}`}
                  >
                    {selectedRequest.status}
                  </span>

                </div>

                {/* CONTACT */}
                <div className="col-span-2">

                  <p className="text-gray-500 text-xs">
                    Contact Name
                  </p>

                  <p>
                    {selectedRequest.firstName} {selectedRequest.lastName}
                  </p>

                </div>

                {/* EMAIL */}
                <div className="col-span-2">

                  <p className="text-gray-500 text-xs">
                    Email
                  </p>

                  <p>
                    {selectedRequest.businessEmail}
                  </p>

                </div>

                {/* PHONE */}
                <div className="col-span-2">

                  <p className="text-gray-500 text-xs">
                    Phone
                  </p>

                  <p>
                    {selectedRequest.phoneNumber}
                  </p>

                </div>

                {/* JOB TITLE */}
                <div className="col-span-2">

                  <p className="text-gray-500 text-xs">
                    Job Title
                  </p>

                  <p>
                    {selectedRequest.jobTitle}
                  </p>

                </div>

                {/* CREATED */}
                <div className="col-span-2">

                  <p className="text-gray-500 text-xs">
                    Submitted On
                  </p>

                  <p>
                    {new Date(selectedRequest.createdAt).toLocaleString()}
                  </p>

                </div>

              </div>

            </div>

            {/* MODAL FOOTER */}
            <div className="border-t p-4 bg-gray-50">

              <div className="flex gap-3">

                {/* EMAIL BUTTON */}
                <a
                  href={`mailto:${selectedRequest.businessEmail}`}
                  className="flex-1 bg-[#007aff] text-white text-center py-2 rounded-lg hover:bg-[#0062cc] transition"
                >
                  Send Email
                </a>

                {/* CALL BUTTON */}
                <a
                  href={`tel:${selectedRequest.phoneNumber}`}
                  className="flex-1 border border-[#007aff] text-[#007aff] text-center py-2 rounded-lg hover:bg-[#007aff] hover:text-white transition"
                >
                  Call Now
                </a>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default DemoRequestsManager;